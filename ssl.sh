#!/usr/bin/env bash
#
# TLS for a shared VPS with NO root access.
#
# certbot is not an option here: it wants /etc/letsencrypt and privileged ports.
# acme.sh is, because it installs into $HOME, runs as your own user, and adds its
# own renewal cron entry — none of which needs sudo.
#
# Ports below 1024 still require root, so this script does NOT try to listen on
# :443. It obtains and renews the certificate and drops the files where the
# host's TLS terminator can read them. Pick whichever applies to your host:
#
#   A. Panel-managed TLS (cPanel, Plesk, CyberPanel, DirectAdmin)
#      The panel already terminates :443. Use `./ssl.sh issue` to get the files,
#      then paste cert + key + chain into the panel's SSL/TLS screen. Many panels
#      also offer one-click AutoSSL — if yours does, use that and skip this
#      script entirely.
#
#   B. Shared nginx/Apache vhost you can edit
#      Point ssl_certificate at ~/ssl/fullchain.pem and ssl_certificate_key at
#      ~/ssl/privkey.pem, and set RELOAD_CMD below so renewals take effect.
#
#   C. Cloudflare (or any CDN) in front
#      Set the SSL mode to "Full (strict)" and install a Cloudflare Origin
#      Certificate instead — it is valid for 15 years and needs no renewal.
#      You still want this script only if you prefer a real Let's Encrypt cert.
#
# Usage:
#   ./ssl.sh install                      install acme.sh into ~/.acme.sh
#   ./ssl.sh issue                        issue via webroot (HTTP-01)
#   DNS_API=dns_cf ./ssl.sh issue         issue via DNS-01 (no open port needed)
#   ./ssl.sh renew                        force a renewal now
#   ./ssl.sh status                       show expiry
#   ./ssl.sh cron                         show the renewal cron entry
#
set -Eeuo pipefail

# ------------------------------------------------------------------ settings --

DOMAIN="${DOMAIN:-kartikeyfastener.com}"
ALT_DOMAIN="${ALT_DOMAIN:-www.kartikeyfastener.com}"
EMAIL="${EMAIL:-info@kaisoul.tech}"

# HTTP-01 needs a directory the public web server already serves for DOMAIN.
# On cPanel that is usually ~/public_html.
WEBROOT="${WEBROOT:-$HOME/public_html}"

# Where the installed certificate lands. Point your vhost here.
SSL_DIR="${SSL_DIR:-$HOME/ssl}"

# Run after every successful renewal. Leave empty if the panel picks the files
# up on its own. Examples:
#   RELOAD_CMD="nginx -s reload"                     # only if you own the master
#   RELOAD_CMD="$HOME/app/deploy.sh restart"         # restart the Node server
RELOAD_CMD="${RELOAD_CMD:-}"

# Set to a provider plugin (dns_cf, dns_gd, dns_namecheap…) to use DNS-01.
# See https://github.com/acmesh-official/acme.sh/wiki/dnsapi for the env vars
# each one expects, e.g. CF_Token / CF_Account_ID for Cloudflare.
DNS_API="${DNS_API:-}"

ACME_HOME="${HOME}/.acme.sh"
ACME="${ACME_HOME}/acme.sh"

# ------------------------------------------------------------------- output ---

if [[ -t 1 ]]; then
  B=$'\033[1m'; G=$'\033[32m'; Y=$'\033[33m'; R=$'\033[31m'; N=$'\033[0m'
else
  B=""; G=""; Y=""; R=""; N=""
fi

log()  { printf '%s==>%s %s\n' "${B}" "${N}" "$*"; }
ok()   { printf '%s  ok%s %s\n' "${G}" "${N}" "$*"; }
warn() { printf '%s  !!%s %s\n' "${Y}" "${N}" "$*"; }
die()  { printf '%s ERR%s %s\n' "${R}" "${N}" "$*" >&2; exit 1; }

trap 'die "failed at line ${LINENO}"' ERR

# ---------------------------------------------------------------- installing --

install_acme() {
  if [[ -x "${ACME}" ]]; then
    ok "acme.sh already installed ($(${ACME} --version | tail -n1))"
    return
  fi

  log "installing acme.sh into ${ACME_HOME}"
  command -v curl >/dev/null 2>&1 || command -v wget >/dev/null 2>&1 \
    || die "need curl or wget to fetch acme.sh"

  local tmp; tmp="$(mktemp -d)"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL https://github.com/acmesh-official/acme.sh/archive/master.tar.gz | tar xz -C "${tmp}"
  else
    wget -qO- https://github.com/acmesh-official/acme.sh/archive/master.tar.gz | tar xz -C "${tmp}"
  fi

  # --home keeps everything under $HOME; the installer adds its own cron entry.
  ( cd "${tmp}/acme.sh-master" && ./acme.sh --install --home "${ACME_HOME}" --accountemail "${EMAIL}" )
  rm -rf "${tmp}"

  [[ -x "${ACME}" ]] || die "acme.sh install failed"
  "${ACME}" --set-default-ca --server letsencrypt >/dev/null
  ok "acme.sh installed, default CA set to Let's Encrypt"
}

require_acme() {
  [[ -x "${ACME}" ]] || die "acme.sh not installed — run ./ssl.sh install first"
}

# -------------------------------------------------------------------- issuing --

issue_cert() {
  require_acme
  mkdir -p "${SSL_DIR}"
  chmod 700 "${SSL_DIR}"

  local args=(--issue -d "${DOMAIN}")
  [[ -n "${ALT_DOMAIN}" ]] && args+=(-d "${ALT_DOMAIN}")

  if [[ -n "${DNS_API}" ]]; then
    log "issuing for ${DOMAIN} via DNS-01 (${DNS_API})"
    warn "the provider credentials must already be exported — see the acme.sh dnsapi wiki"
    args+=(--dns "${DNS_API}")
  else
    log "issuing for ${DOMAIN} via HTTP-01 (webroot ${WEBROOT})"
    [[ -d "${WEBROOT}" ]] || die "webroot ${WEBROOT} does not exist — set WEBROOT= or use DNS_API="
    # The validation file must be reachable at
    #   http://DOMAIN/.well-known/acme-challenge/<token>
    # Next.js serves /public, so WEBROOT=./public works when the app is the
    # only thing answering on :80 for this domain.
    args+=(-w "${WEBROOT}")
  fi

  # acme.sh exits 2 when the cert is still valid and no renewal was needed.
  set +e
  "${ACME}" "${args[@]}"
  local rc=$?
  set -e
  if (( rc != 0 && rc != 2 )); then
    die "issuance failed (exit ${rc}) — check DNS resolves to this host and the webroot is public"
  fi
  (( rc == 2 )) && warn "certificate still valid; nothing was reissued"

  install_cert
}

install_cert() {
  require_acme
  mkdir -p "${SSL_DIR}"

  log "installing certificate into ${SSL_DIR}"
  local args=(
    --install-cert -d "${DOMAIN}"
    --key-file       "${SSL_DIR}/privkey.pem"
    --fullchain-file "${SSL_DIR}/fullchain.pem"
    --cert-file      "${SSL_DIR}/cert.pem"
    --ca-file        "${SSL_DIR}/chain.pem"
  )
  [[ -n "${RELOAD_CMD}" ]] && args+=(--reloadcmd "${RELOAD_CMD}")

  "${ACME}" "${args[@]}"

  chmod 600 "${SSL_DIR}"/*.pem 2>/dev/null || true
  ok "certificate installed"
  printf '\n'
  printf '  fullchain : %s/fullchain.pem\n' "${SSL_DIR}"
  printf '  key       : %s/privkey.pem\n'   "${SSL_DIR}"
  printf '  cert only : %s/cert.pem\n'      "${SSL_DIR}"
  printf '  chain     : %s/chain.pem\n'     "${SSL_DIR}"
  printf '\n'

  if [[ -z "${RELOAD_CMD}" ]]; then
    warn "RELOAD_CMD is empty — after each renewal you must re-upload the files"
    warn "in the panel, or set RELOAD_CMD at the top of this script."
  fi
}

# -------------------------------------------------------------------- upkeep --

renew_cert() {
  require_acme
  log "forcing renewal for ${DOMAIN}"
  "${ACME}" --renew -d "${DOMAIN}" --force
  install_cert
}

show_status() {
  require_acme
  log "certificates known to acme.sh"
  "${ACME}" --list

  if [[ -f "${SSL_DIR}/fullchain.pem" ]] && command -v openssl >/dev/null 2>&1; then
    printf '\n'
    log "installed certificate"
    openssl x509 -in "${SSL_DIR}/fullchain.pem" -noout -subject -issuer -dates
  fi
}

show_cron() {
  log "acme.sh renewal cron entry"
  crontab -l 2>/dev/null | grep -F "acme.sh" || warn "no acme.sh cron entry found — re-run ./ssl.sh install"
  printf '\n'
  printf 'acme.sh renews automatically at ~60 days. Nothing else is scheduled;\n'
  printf 'renewal runs as your user, so no root is involved.\n'
}

# --------------------------------------------------------------------- main ---

case "${1:-help}" in
  install) install_acme ;;
  issue)   install_acme; issue_cert ;;
  deploy)  install_cert ;;
  renew)   renew_cert ;;
  status)  show_status ;;
  cron)    show_cron ;;
  help|*)
    cat <<EOF
${B}ssl.sh${N} — Let's Encrypt on a shared VPS without root

  install   install acme.sh into ~/.acme.sh (no sudo required)
  issue     obtain the certificate and install it into \$SSL_DIR
  deploy    re-install the existing certificate into \$SSL_DIR
  renew     force a renewal now
  status    list certificates and show expiry dates
  cron      show the auto-renewal cron entry

Configure by environment variable or by editing the top of this file:

  DOMAIN=${DOMAIN}
  ALT_DOMAIN=${ALT_DOMAIN}
  EMAIL=${EMAIL}
  WEBROOT=${WEBROOT}
  SSL_DIR=${SSL_DIR}
  DNS_API=${DNS_API:-<unset — using HTTP-01>}
  RELOAD_CMD=${RELOAD_CMD:-<unset>}

${B}Which validation method?${N}
  HTTP-01 (default) needs port 80 for DOMAIN to serve \$WEBROOT publicly.
  DNS-01 needs no open port at all and is the safer bet on a locked-down
  shared host — export your provider's credentials, then:

      export CF_Token=...  CF_Account_ID=...
      DNS_API=dns_cf ./ssl.sh issue

${B}Remember${N}: binding :443 requires root. This script only obtains and
renews the certificate. Something you do not control — the panel, the shared
nginx, or a CDN — has to terminate TLS and proxy through to the Node server
on \${PORT:-3000}. See deploy.sh.
EOF
    ;;
esac
