#!/usr/bin/env bash
#
# Kartikey Fasteners — Next.js VPS deployment
# nginx + Let's Encrypt / Certbot
#

set -Eeuo pipefail

APP_NAME="kartikey-fasteners"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RELEASES_DIR="${APP_DIR}/.releases"
CURRENT_LINK="${APP_DIR}/.current"
RUN_DIR="${APP_DIR}/.run"

PID_FILE="${RUN_DIR}/${APP_NAME}.pid"
LOG_FILE="${RUN_DIR}/${APP_NAME}.log"

NGINX_CONF="/etc/nginx/sites-available/${APP_NAME}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${APP_NAME}.conf"

KEEP_RELEASES=3

PORT="${PORT:-3000}"
HOSTNAME_BIND="127.0.0.1"

DOMAIN="${DOMAIN:-}"
ENABLE_SSL="${ENABLE_SSL:-yes}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"

NODE_HEAP_MB="${NODE_HEAP_MB:-1024}"

# ---------------------------------------------------------------
# Output
# ---------------------------------------------------------------

if [[ -t 1 ]]; then
    B=$'\033[1m'
    G=$'\033[32m'
    Y=$'\033[33m'
    R=$'\033[31m'
    D=$'\033[2m'
    N=$'\033[0m'
else
    B=""
    G=""
    Y=""
    R=""
    D=""
    N=""
fi

log() {
    printf '%s==>%s %s\n' "${B}" "${N}" "$*"
}

ok() {
    printf '%s  ok%s %s\n' "${G}" "${N}" "$*"
}

warn() {
    printf '%s  !!%s %s\n' "${Y}" "${N}" "$*"
}

die() {
    printf '%s ERR%s %s\n' "${R}" "${N}" "$*" >&2
    exit 1
}

trap 'die "failed at line ${LINENO}"' ERR

# ---------------------------------------------------------------
# Root check
# ---------------------------------------------------------------

require_root() {
    if [[ "${EUID}" -eq 0 ]]; then
        return
    fi

    command -v sudo >/dev/null 2>&1 \
        || die "Root privileges are required for nginx/Certbot."

    warn "This script needs sudo for nginx and Certbot."
}

# ---------------------------------------------------------------
# Ask deployment settings
# ---------------------------------------------------------------

prompt_settings() {

    echo
    echo "=============================================="
    echo "        Kartikey Fasteners Deployment"
    echo "=============================================="
    echo

    if [[ -z "${DOMAIN}" ]]; then
        read -r -p "Enter domain (example.com): " DOMAIN
    fi

    # Remove protocol if user enters it
    DOMAIN="${DOMAIN#http://}"
    DOMAIN="${DOMAIN#https://}"
    DOMAIN="${DOMAIN%%/*}"

    [[ -n "${DOMAIN}" ]] \
        || die "Domain cannot be empty."

    [[ "${DOMAIN}" =~ ^[A-Za-z0-9.-]+$ ]] \
        || die "Invalid domain: ${DOMAIN}"

    echo

    read -r -p "Enter application port [${PORT}]: " INPUT_PORT

    PORT="${INPUT_PORT:-${PORT}}"

    [[ "${PORT}" =~ ^[0-9]+$ ]] \
        || die "Invalid port: ${PORT}"

    (( PORT >= 1 && PORT <= 65535 )) \
        || die "Port must be between 1 and 65535."

    (( PORT != 80 && PORT != 443 )) \
        || die "Do not run Next.js directly on port 80/443. nginx uses those ports."

    echo

    read -r -p "Enable HTTPS with Let's Encrypt/Certbot? [Y/n]: " SSL_ANSWER

    SSL_ANSWER="${SSL_ANSWER:-Y}"

    case "${SSL_ANSWER,,}" in
        y|yes)
            ENABLE_SSL="yes"
            ;;
        n|no)
            ENABLE_SSL="no"
            ;;
        *)
            die "Please answer yes or no."
            ;;
    esac

    if [[ "${ENABLE_SSL}" == "yes" && -z "${CERTBOT_EMAIL}" ]]; then
        echo
        read -r -p "Email for Let's Encrypt renewal notices: " CERTBOT_EMAIL

        [[ -n "${CERTBOT_EMAIL}" ]] \
            || die "Email is required for Certbot."
    fi

    echo
    echo "----------------------------------------------"
    echo "Domain       : ${DOMAIN}"
    echo "Application  : 127.0.0.1:${PORT}"
    echo "HTTPS        : ${ENABLE_SSL}"
    if [[ "${ENABLE_SSL}" == "yes" ]]; then
        echo "SSL Email    : ${CERTBOT_EMAIL}"
    fi
    echo "----------------------------------------------"
    echo

    read -r -p "Continue with these settings? [Y/n]: " CONFIRM

    CONFIRM="${CONFIRM:-Y}"

    [[ "${CONFIRM,,}" == "y" || "${CONFIRM,,}" == "yes" ]] \
        || die "Deployment cancelled."
}

# ---------------------------------------------------------------
# Node
# ---------------------------------------------------------------

bootstrap_node() {

    if command -v node >/dev/null 2>&1; then
        return
    fi

    if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then

        export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

        # shellcheck disable=SC1090
        . "${NVM_DIR}/nvm.sh"

        nvm use --lts >/dev/null 2>&1 || true
    fi
}

# ---------------------------------------------------------------
# Environment
# ---------------------------------------------------------------

check_env() {

    bootstrap_node

    command -v node >/dev/null 2>&1 \
        || die "Node.js not found."

    command -v npm >/dev/null 2>&1 \
        || die "npm not found."

    local major

    major="$(node -p 'process.versions.node.split(".")[0]')"

    (( major >= 20 )) \
        || die "Node 20+ required. Found $(node -v)"

    ok "Node $(node -v)"
    ok "npm $(npm -v)"

    if [[ ! -f "${APP_DIR}/.env.production.local" &&
          ! -f "${APP_DIR}/.env.local" ]]; then

        warn "No .env.production.local or .env.local found."
    fi

    if [[ -r /proc/meminfo ]]; then

        local avail_mb

        avail_mb=$(
            awk '/MemAvailable/ {
                print $2
            }' /proc/meminfo
        )

        avail_mb=$((avail_mb / 1024))

        if (( avail_mb < 700 )); then
            warn "Only ${avail_mb} MB RAM available."
            warn "If build gets killed, try NODE_HEAP_MB=768 ./deploy.sh build"
        else
            ok "${avail_mb} MB RAM available"
        fi
    fi

    mkdir -p "${RUN_DIR}"
    mkdir -p "${RELEASES_DIR}"
}

# ---------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------

install_deps() {

    log "Installing dependencies"

    cd "${APP_DIR}"

    npm config set fund false --location project >/dev/null 2>&1 || true
    npm config set audit false --location project >/dev/null 2>&1 || true

    if [[ -f package-lock.json ]]; then

        npm ci \
            --no-audit \
            --no-fund \
            --maxsockets 3

    else

        npm install \
            --no-audit \
            --no-fund \
            --maxsockets 3

    fi

    ok "Dependencies installed"
}

# ---------------------------------------------------------------
# Build
# ---------------------------------------------------------------

build_app() {

    log "Building application"

    cd "${APP_DIR}"

    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export UV_THREADPOOL_SIZE=2

    export NODE_OPTIONS="--max-old-space-size=${NODE_HEAP_MB}"

    local started

    started=$(date +%s)

    if command -v nice >/dev/null 2>&1; then
        nice -n 10 npm run build
    else
        npm run build
    fi

    [[ -f ".next/standalone/server.js" ]] \
        || die "Standalone output missing. Check next.config.ts."

    ok "Build completed in $(( $(date +%s) - started )) seconds"
}

# ---------------------------------------------------------------
# Release
# ---------------------------------------------------------------

assemble_release() {

    local stamp
    local release

    stamp="$(date +%Y%m%d-%H%M%S)"
    release="${RELEASES_DIR}/${stamp}"

    log "Creating release ${stamp}"

    mkdir -p "${release}"

    cp -r "${APP_DIR}/.next/standalone/." \
        "${release}/"

    mkdir -p "${release}/.next"

    cp -r "${APP_DIR}/.next/static" \
        "${release}/.next/static"

    if [[ -d "${APP_DIR}/public" ]]; then
        cp -r "${APP_DIR}/public" \
            "${release}/public"
    fi

    for f in \
        .env.production.local \
        .env.local \
        .env
    do

        if [[ -f "${APP_DIR}/${f}" ]]; then
            ln -sf "${APP_DIR}/${f}" \
                "${release}/${f}"
        fi

    done

    ln -sfn "${release}" \
        "${CURRENT_LINK}"

    ok "Release ready"

    prune_releases
}

prune_releases() {

    local count

    count=$(
        find "${RELEASES_DIR}" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d |
        wc -l
    )

    if (( count > KEEP_RELEASES )); then

        find "${RELEASES_DIR}" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d |
        sort |
        head -n "$((count - KEEP_RELEASES))" |
        while read -r old; do

            rm -rf "${old}"

            log "Removed old release $(basename "${old}")"

        done
    fi
}

# ---------------------------------------------------------------
# Application process
# ---------------------------------------------------------------

is_running() {

    [[ -f "${PID_FILE}" ]] || return 1

    local pid

    pid="$(cat "${PID_FILE}")"

    [[ -n "${pid}" ]] &&
        kill -0 "${pid}" 2>/dev/null
}

start_app() {

    if is_running; then
        warn "Already running (PID $(cat "${PID_FILE}"))"
        return
    fi

    [[ -e "${CURRENT_LINK}" ]] \
        || die "No release found."

    log "Starting Next.js on ${HOSTNAME_BIND}:${PORT}"

    if command -v pm2 >/dev/null 2>&1; then

        cd "${CURRENT_LINK}"

        PORT="${PORT}" \
        HOSTNAME="${HOSTNAME_BIND}" \
        NODE_ENV=production \
            pm2 start server.js \
                --name "${APP_NAME}" \
                --update-env \
                --max-memory-restart 400M

        pm2 save >/dev/null 2>&1 || true

        ok "Started under PM2"

        return
    fi

    cd "${CURRENT_LINK}"

    PORT="${PORT}" \
    HOSTNAME="${HOSTNAME_BIND}" \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
        nohup node server.js \
        >>"${LOG_FILE}" 2>&1 &

    echo $! > "${PID_FILE}"

    sleep 2

    is_running || {

        tail -n 30 "${LOG_FILE}" >&2 || true

        die "Server exited during startup."
    }

    ok "Server started"
}

stop_app() {

    if command -v pm2 >/dev/null 2>&1 &&
       pm2 describe "${APP_NAME}" >/dev/null 2>&1; then

        pm2 stop "${APP_NAME}" >/dev/null
        pm2 delete "${APP_NAME}" >/dev/null

        ok "Stopped PM2 process"

        return
    fi

    if is_running; then

        local pid

        pid="$(cat "${PID_FILE}")"

        kill "${pid}" 2>/dev/null || true

        for _ in $(seq 1 20); do

            is_running || break

            sleep 0.5
        done

        is_running &&
            kill -9 "${pid}" 2>/dev/null || true

        rm -f "${PID_FILE}"

        ok "Server stopped"

    else

        warn "Server is not running"
    fi
}

health_check() {

    local url

    url="http://${HOSTNAME_BIND}:${PORT}/"

    command -v curl >/dev/null 2>&1 || {
        warn "curl unavailable; skipping health check"
        return
    }

    for _ in $(seq 1 20); do

        if curl \
            -fsS \
            -o /dev/null \
            --max-time 5 \
            "${url}"; then

            ok "Application health check passed"

            return
        fi

        sleep 1
    done

    tail -n 30 "${LOG_FILE}" >&2 || true

    die "Application health check failed."
}

# ---------------------------------------------------------------
# nginx
# ---------------------------------------------------------------

install_nginx() {

    if command -v nginx >/dev/null 2>&1; then
        return
    fi

    require_root

    log "Installing nginx"

    if command -v apt-get >/dev/null 2>&1; then

        apt-get update

        DEBIAN_FRONTEND=noninteractive \
            apt-get install -y nginx

    elif command -v dnf >/dev/null 2>&1; then

        dnf install -y nginx

    elif command -v yum >/dev/null 2>&1; then

        yum install -y nginx

    else

        die "Could not find apt-get, dnf, or yum."
    fi
}

configure_nginx() {

    require_root

    install_nginx

    mkdir -p \
        /etc/nginx/sites-available \
        /etc/nginx/sites-enabled

    log "Configuring nginx"

    cat > "${NGINX_CONF}" <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name ${DOMAIN};

    location / {
        proxy_pass http://${HOSTNAME_BIND}:${PORT};

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 60s;
    }
}
EOF

    ln -sfn \
        "${NGINX_CONF}" \
        "${NGINX_ENABLED}"

    # Remove default nginx website
    rm -f \
        /etc/nginx/sites-enabled/default \
        2>/dev/null || true

    nginx -t

    systemctl enable nginx >/dev/null 2>&1 || true

    systemctl restart nginx

    ok "nginx configured"
    ok "${DOMAIN} -> ${HOSTNAME_BIND}:${PORT}"
}

# ---------------------------------------------------------------
# Certbot
# ---------------------------------------------------------------

install_certbot() {

    if command -v certbot >/dev/null 2>&1; then
        return
    fi

    require_root

    log "Installing Certbot"

    if command -v apt-get >/dev/null 2>&1; then

        apt-get update

        DEBIAN_FRONTEND=noninteractive \
            apt-get install -y \
            certbot \
            python3-certbot-nginx

    elif command -v dnf >/dev/null 2>&1; then

        dnf install -y \
            certbot \
            python3-certbot-nginx

    elif command -v yum >/dev/null 2>&1; then

        yum install -y \
            certbot \
            python3-certbot-nginx

    else

        die "Could not find a supported package manager."
    fi
}

configure_ssl() {

    if [[ "${ENABLE_SSL}" != "yes" ]]; then

        warn "HTTPS disabled"

        return
    fi

    require_root
    install_certbot

    log "Requesting Let's Encrypt certificate"

    certbot \
        --nginx \
        --non-interactive \
        --agree-tos \
        --email "${CERTBOT_EMAIL}" \
        -d "${DOMAIN}" \
        --redirect

    systemctl enable certbot.timer \
        >/dev/null 2>&1 || true

    systemctl start certbot.timer \
        >/dev/null 2>&1 || true

    ok "HTTPS enabled"
    ok "https://${DOMAIN}"
}

# ---------------------------------------------------------------
# Rollback
# ---------------------------------------------------------------

rollback() {

    local prev

    prev=$(
        find "${RELEASES_DIR}" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d |
        sort |
        tail -n 2 |
        head -n 1
    )

    [[ -n "${prev}" ]] \
        || die "No previous release available."

    log "Rolling back to $(basename "${prev}")"

    stop_app

    ln -sfn \
        "${prev}" \
        "${CURRENT_LINK}"

    start_app

    health_check
}

# ---------------------------------------------------------------
# Main
# ---------------------------------------------------------------

case "${1:-deploy}" in

    deploy)

        prompt_settings

        check_env

        install_deps

        build_app

        assemble_release

        stop_app

        start_app

        health_check

        configure_nginx

        configure_ssl

        echo
        echo "=============================================="
        echo "              DEPLOYMENT COMPLETE"
        echo "=============================================="
        echo
        echo "Application : http://${HOSTNAME_BIND}:${PORT}"
        echo "Domain      : ${DOMAIN}"

        if [[ "${ENABLE_SSL}" == "yes" ]]; then
            echo "Website     : https://${DOMAIN}"
        else
            echo "Website     : http://${DOMAIN}"
        fi

        echo
        ;;

    build)

        check_env
        build_app
        assemble_release
        ;;

    start)

        check_env
        start_app
        health_check
        ;;

    restart)

        check_env
        stop_app
        start_app
        health_check
        ;;

    stop)

        stop_app
        ;;

    status)

        if is_running; then

            ok "Running (PID $(cat "${PID_FILE}"))"
            ok "Listening on ${HOSTNAME_BIND}:${PORT}"

        elif command -v pm2 >/dev/null 2>&1 &&
             pm2 describe "${APP_NAME}" >/dev/null 2>&1; then

            pm2 describe "${APP_NAME}"

        else

            warn "Not running"
        fi

        ;;

    logs)

        tail -f "${LOG_FILE}"
        ;;

    rollback)

        check_env
        rollback
        ;;

    *)

        die "Unknown command '${1}'"

        ;;

esac
