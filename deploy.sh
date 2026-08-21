#!/usr/bin/env bash
#
# Kartikey Fasteners — deploy to a shared VPS with no root access.
#
# Assumes:
#   * you have SSH access as an unprivileged user
#   * Node 20+ is on PATH (or nvm is installed — see bootstrap_node below)
#   * the host runs a reverse proxy (cPanel / Plesk / CyberPanel / shared nginx)
#     that terminates TLS on :443 and forwards to a port you own
#   * one CPU, one thread, and not much RAM
#
# Usage:
#   ./deploy.sh                 full deploy: install, build, restart
#   ./deploy.sh build           build only
#   ./deploy.sh restart         restart the running server only
#   ./deploy.sh stop            stop the server
#   ./deploy.sh status          is it up?
#   ./deploy.sh logs            tail the log
#   ./deploy.sh rollback        swap back to the previous release
#
set -Eeuo pipefail

# ------------------------------------------------------------------ settings --

APP_NAME="kartikey-fasteners"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASES_DIR="${APP_DIR}/.releases"
CURRENT_LINK="${APP_DIR}/.current"
RUN_DIR="${APP_DIR}/.run"
PID_FILE="${RUN_DIR}/${APP_NAME}.pid"
LOG_FILE="${RUN_DIR}/${APP_NAME}.log"
KEEP_RELEASES=3

PORT="${PORT:-3000}"
HOSTNAME_BIND="${HOSTNAME:-127.0.0.1}"

# One core: cap the heap so the build fails loudly instead of inviting the OOM
# killer, and stop Next from spawning workers it has no core for.
NODE_HEAP_MB="${NODE_HEAP_MB:-1024}"

# ------------------------------------------------------------------- output ---

if [[ -t 1 ]]; then
  B=$'\033[1m'; G=$'\033[32m'; Y=$'\033[33m'; R=$'\033[31m'; D=$'\033[2m'; N=$'\033[0m'
else
  B=""; G=""; Y=""; R=""; D=""; N=""
fi

log()  { printf '%s==>%s %s\n' "${B}" "${N}" "$*"; }
ok()   { printf '%s  ok%s %s\n' "${G}" "${N}" "$*"; }
warn() { printf '%s  !!%s %s\n' "${Y}" "${N}" "$*"; }
die()  { printf '%s ERR%s %s\n' "${R}" "${N}" "$*" >&2; exit 1; }

trap 'die "failed at line ${LINENO}"' ERR

# --------------------------------------------------------------- environment --

bootstrap_node() {
  if command -v node >/dev/null 2>&1; then return; fi
  # No system node — fall back to a user-local nvm, which needs no root.
  # shellcheck disable=SC1090
  if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    . "${NVM_DIR}/nvm.sh"
    nvm use --lts >/dev/null 2>&1 || true
  fi
}

check_env() {
  bootstrap_node
  command -v node >/dev/null 2>&1 || die "node not found on PATH"
  command -v npm  >/dev/null 2>&1 || die "npm not found on PATH"

  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  (( major >= 20 )) || die "Node 20+ required, found $(node -v)"
  ok "node $(node -v), npm $(npm -v)"

  [[ -f "${APP_DIR}/.env.production.local" || -f "${APP_DIR}/.env.local" ]] \
    || warn "no .env.production.local — RESEND_API_KEY will be missing and the enquiry form will 503"

  # Report available memory where the kernel exposes it; a 1 GB box with no swap
  # is the usual reason a Next build dies without a message.
  if [[ -r /proc/meminfo ]]; then
    local avail_mb
    avail_mb=$(( $(awk '/MemAvailable/ {print $2}' /proc/meminfo) / 1024 ))
    if (( avail_mb < 700 )); then
      warn "only ${avail_mb} MB RAM available — build may be tight"
      warn "if it is killed, run: ./deploy.sh build with NODE_HEAP_MB=768"
    else
      ok "${avail_mb} MB RAM available"
    fi
  fi

  mkdir -p "${RUN_DIR}" "${RELEASES_DIR}"
}

# ---------------------------------------------------------------- installing --

install_deps() {
  log "installing dependencies"
  cd "${APP_DIR}"

  # npm's own concurrency is the other thing that swamps a single core.
  npm config set fund false --location project >/dev/null 2>&1 || true
  npm config set audit false --location project >/dev/null 2>&1 || true

  if [[ -f package-lock.json ]]; then
    npm ci --no-audit --no-fund --maxsockets 3
  else
    warn "no package-lock.json — falling back to npm install"
    npm install --no-audit --no-fund --maxsockets 3
  fi
  ok "dependencies installed"
}

# ------------------------------------------------------------------ building --

build_app() {
  log "building (heap ${NODE_HEAP_MB} MB, 1 worker)"
  cd "${APP_DIR}"

  export NODE_ENV=production
  export NEXT_TELEMETRY_DISABLED=1
  export UV_THREADPOOL_SIZE=2
  export NODE_OPTIONS="--max-old-space-size=${NODE_HEAP_MB}"

  local started
  started=$(date +%s)

  # `nice` keeps the build from starving anything else the shared box is doing.
  if command -v nice >/dev/null 2>&1; then
    nice -n 10 npm run build
  else
    npm run build
  fi

  [[ -f .next/standalone/server.js ]] \
    || die "standalone output missing — is output:'standalone' still set in next.config.ts?"

  ok "built in $(( $(date +%s) - started ))s"
}

# --------------------------------------------------------------- assembling ---

# The standalone bundle deliberately excludes /public and the static chunks,
# so both have to be copied in beside server.js.
assemble_release() {
  local stamp release
  stamp="$(date +%Y%m%d-%H%M%S)"
  release="${RELEASES_DIR}/${stamp}"

  log "assembling release ${stamp}"
  mkdir -p "${release}"

  cp -r "${APP_DIR}/.next/standalone/." "${release}/"
  mkdir -p "${release}/.next"
  cp -r "${APP_DIR}/.next/static" "${release}/.next/static"
  [[ -d "${APP_DIR}/public" ]] && cp -r "${APP_DIR}/public" "${release}/public"

  # Env files are not bundled — link them so a key rotation needs no redeploy.
  for f in .env.production.local .env.local .env; do
    [[ -f "${APP_DIR}/${f}" ]] && ln -sf "${APP_DIR}/${f}" "${release}/${f}"
  done

  ln -sfn "${release}" "${CURRENT_LINK}"
  ok "release ready: $(du -sh "${release}" | cut -f1)"

  prune_releases
}

prune_releases() {
  local count
  count=$(find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d | wc -l)
  if (( count > KEEP_RELEASES )); then
    find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d | sort \
      | head -n "$(( count - KEEP_RELEASES ))" \
      | while read -r old; do rm -rf "${old}"; log "pruned $(basename "${old}")"; done
  fi
}

# ------------------------------------------------------------------- process --

is_running() {
  [[ -f "${PID_FILE}" ]] || return 1
  local pid; pid="$(cat "${PID_FILE}")"
  [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null
}

start_app() {
  if is_running; then warn "already running (pid $(cat "${PID_FILE}"))"; return; fi
  [[ -e "${CURRENT_LINK}" ]] || die "no release to start — run ./deploy.sh first"

  log "starting on ${HOSTNAME_BIND}:${PORT}"

  # PM2 if the host provides it, since it survives reboots and restarts on crash.
  if command -v pm2 >/dev/null 2>&1; then
    cd "${CURRENT_LINK}"
    PORT="${PORT}" HOSTNAME="${HOSTNAME_BIND}" NODE_ENV=production \
      pm2 start server.js --name "${APP_NAME}" --update-env --max-memory-restart 400M
    pm2 save >/dev/null 2>&1 || true
    ok "started under pm2"
    return
  fi

  # Otherwise nohup, which is all an unprivileged shell account really needs.
  cd "${CURRENT_LINK}"
  PORT="${PORT}" HOSTNAME="${HOSTNAME_BIND}" NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    nohup node server.js >>"${LOG_FILE}" 2>&1 &
  echo $! > "${PID_FILE}"

  sleep 2
  is_running || { tail -n 30 "${LOG_FILE}" >&2; die "server exited on startup"; }
  ok "started (pid $(cat "${PID_FILE}")), logging to ${LOG_FILE}"
}

stop_app() {
  if command -v pm2 >/dev/null 2>&1 && pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
    pm2 stop "${APP_NAME}" >/dev/null && pm2 delete "${APP_NAME}" >/dev/null
    ok "stopped (pm2)"
    return
  fi
  if is_running; then
    local pid; pid="$(cat "${PID_FILE}")"
    kill "${pid}" 2>/dev/null || true
    for _ in $(seq 1 20); do is_running || break; sleep 0.5; done
    is_running && kill -9 "${pid}" 2>/dev/null || true
    rm -f "${PID_FILE}"
    ok "stopped"
  else
    warn "not running"
  fi
}

health_check() {
  local url="http://${HOSTNAME_BIND}:${PORT}/"
  command -v curl >/dev/null 2>&1 || { warn "curl unavailable, skipping health check"; return; }

  for i in $(seq 1 20); do
    if curl -fsS -o /dev/null --max-time 5 "${url}"; then
      ok "health check passed (${url})"
      return
    fi
    sleep 1
    [[ $i == 20 ]] && { tail -n 30 "${LOG_FILE}" 2>/dev/null >&2 || true; die "health check failed"; }
  done
}

rollback() {
  local prev
  prev=$(find "${RELEASES_DIR}" -mindepth 1 -maxdepth 1 -type d | sort | tail -n 2 | head -n 1)
  [[ -n "${prev}" ]] || die "no previous release to roll back to"
  log "rolling back to $(basename "${prev}")"
  stop_app
  ln -sfn "${prev}" "${CURRENT_LINK}"
  start_app
  health_check
}

# --------------------------------------------------------------------- main ---

case "${1:-deploy}" in
  deploy)
    check_env
    install_deps
    build_app
    assemble_release
    stop_app
    start_app
    health_check
    log "done — proxy :443 to ${HOSTNAME_BIND}:${PORT} (see ssl.sh)"
    ;;
  build)    check_env; build_app; assemble_release ;;
  start)    check_env; start_app; health_check ;;
  restart)  check_env; stop_app; start_app; health_check ;;
  stop)     stop_app ;;
  status)
    if is_running; then
      ok "running (pid $(cat "${PID_FILE}")) on ${HOSTNAME_BIND}:${PORT}"
    elif command -v pm2 >/dev/null 2>&1 && pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
      pm2 describe "${APP_NAME}"
    else
      warn "not running"
    fi
    ;;
  logs)     tail -f "${LOG_FILE}" ;;
  rollback) check_env; rollback ;;
  *)        die "unknown command '${1}' — try: deploy|build|start|restart|stop|status|logs|rollback" ;;
esac
