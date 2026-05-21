#!/usr/bin/env bash
# =============================================================================
#  PandaEducation - HTTPS Setup Helper
#
#  Jalankan sekali per mesin setelah `docker compose up`.
#  Script ini:
#    1. Extract CA cert dari container (Caddy internal CA)
#    2. Simpan ke docker/certs/caddy-local-ca.crt
#    3. Tunjukkan cara trust CA + tambah hosts file per OS
#
#  Usage:
#    ./docker/setup-https.sh
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CERT_DIR="$SCRIPT_DIR/certs"
CA_FILE="$CERT_DIR/pandaeducation-dev-ca.crt"
DOMAIN="${APP_DOMAIN:-pandaeducation.test}"
CONTAINER="pandaeducation-app"

# Colors
C_RESET="\033[0m"; C_BOLD="\033[1m"; C_DIM="\033[2m"
C_RED="\033[31m";  C_GREEN="\033[32m"; C_YELLOW="\033[33m"
C_BLUE="\033[34m"; C_MAGENTA="\033[35m"; C_CYAN="\033[36m"
CHECK="${C_GREEN}✔${C_RESET}"
CROSS="${C_RED}✘${C_RESET}"
ARROW="${C_MAGENTA}➜${C_RESET}"

echo ""
echo -e "${C_MAGENTA}${C_BOLD}  ╔═══════════════════════════════════════╗${C_RESET}"
echo -e "${C_MAGENTA}${C_BOLD}  ║   PandaEducation  HTTPS Setup         ║${C_RESET}"
echo -e "${C_MAGENTA}${C_BOLD}  ╚═══════════════════════════════════════╝${C_RESET}"
echo ""

# ---------------------------------------------------------------------------
# 1. Pastikan container sudah running
# ---------------------------------------------------------------------------
echo -e "${C_CYAN}${C_BOLD}[1/4]${C_RESET} Cek container ${C_BOLD}${CONTAINER}${C_RESET}..."
if ! docker inspect "$CONTAINER" --format '{{.State.Status}}' 2>/dev/null | grep -q "running"; then
    echo -e "  ${CROSS} Container belum running."
    echo -e "  ${C_DIM}Jalankan dulu: docker compose up -d app${C_RESET}"
    exit 1
fi
echo -e "  ${CHECK} Container running"

# ---------------------------------------------------------------------------
# 2. Tunggu Caddy CA terbentuk (bisa butuh beberapa detik saat pertama kali)
# ---------------------------------------------------------------------------
echo ""
echo -e "${C_CYAN}${C_BOLD}[2/4]${C_RESET} Menunggu Caddy CA certificate terbentuk..."
CA_PATH="/data/caddy/pki/authorities/local/root.crt"
WAIT=0
MAX=60
while ! docker exec "$CONTAINER" test -f "$CA_PATH" 2>/dev/null; do
    if [ "$WAIT" -ge "$MAX" ]; then
        echo -e "  ${CROSS} CA cert belum terbentuk setelah ${MAX}s."
        echo -e "  ${C_DIM}Cek log: docker compose logs app${C_RESET}"
        exit 1
    fi
    printf "\r  ${C_DIM}Menunggu... (%ss)${C_RESET}  " "$WAIT"
    sleep 2
    WAIT=$((WAIT + 2))
done
echo -e "  ${CHECK} CA cert ditemukan di container"

# ---------------------------------------------------------------------------
# 3. Extract CA cert ke host
# ---------------------------------------------------------------------------
echo ""
echo -e "${C_CYAN}${C_BOLD}[3/4]${C_RESET} Menyimpan CA cert ke ${C_BOLD}docker/certs/${C_RESET}..."
mkdir -p "$CERT_DIR"
docker cp "${CONTAINER}:${CA_PATH}" "$CA_FILE"
echo -e "  ${CHECK} Tersimpan: ${C_BOLD}${CA_FILE}${C_RESET}"

# ---------------------------------------------------------------------------
# 4. Instruksi per OS
# ---------------------------------------------------------------------------
echo ""
echo -e "${C_CYAN}${C_BOLD}[4/4]${C_RESET} Cara trust CA — pilih sesuai OS kamu:"
echo ""

# Deteksi OS
OS="$(uname -s 2>/dev/null || echo "Unknown")"

if [[ "$OS" == "Darwin" ]]; then
    echo -e "  ${ARROW} ${C_BOLD}macOS${C_RESET}"
    echo -e "  ${C_DIM}Jalankan perintah ini di terminal (butuh password):${C_RESET}"
    echo ""
    echo -e "    ${C_CYAN}sudo security add-trusted-cert -d -r trustRoot \\"
    echo -e "      -k /Library/Keychains/System.keychain \\"
    echo -e "      \"${CA_FILE}\"${C_RESET}"
    echo ""

elif [[ "$OS" == "Linux" ]]; then
    echo -e "  ${ARROW} ${C_BOLD}Linux (Ubuntu/Debian)${C_RESET}"
    echo ""
    echo -e "    ${C_CYAN}sudo cp \"${CA_FILE}\" /usr/local/share/ca-certificates/pandaeducation-dev-ca.crt"
    echo -e "    sudo update-ca-certificates${C_RESET}"
    echo ""
    echo -e "  ${ARROW} ${C_BOLD}Linux (Fedora/RHEL/CentOS)${C_RESET}"
    echo ""
    echo -e "    ${C_CYAN}sudo cp \"${CA_FILE}\" /etc/pki/ca-trust/source/anchors/pandaeducation-dev-ca.crt"
    echo -e "    sudo update-ca-trust${C_RESET}"
    echo ""
    echo -e "  ${ARROW} ${C_BOLD}Chrome di Linux${C_RESET} (tambahan — chrome punya trust store sendiri)"
    echo ""
    echo -e "    ${C_CYAN}certutil -d sql:\$HOME/.pki/nssdb -A \\"
    echo -e "      -n 'PandaEducation Dev CA' -t 'CT,,' \\"
    echo -e "      -i \"${CA_FILE}\"${C_RESET}"
    echo ""
else
    # Windows (MINGW/MSYS/WSL or unknown)
    WIN_PATH=$(cygpath -w "$CA_FILE" 2>/dev/null || echo "$CA_FILE")
    echo -e "  ${ARROW} ${C_BOLD}Windows${C_RESET}"
    echo -e "  ${C_DIM}Buka PowerShell sebagai Administrator, jalankan:${C_RESET}"
    echo ""
    echo -e "    ${C_CYAN}Import-Certificate -FilePath \"${WIN_PATH}\" \\"
    echo -e "      -CertStoreLocation Cert:\\LocalMachine\\Root${C_RESET}"
    echo ""
    echo -e "  ${C_DIM}Atau: klik dua kali file .crt → Install Certificate → Local Machine → Trusted Root${C_RESET}"
    echo ""
fi

# ---------------------------------------------------------------------------
# Hosts file
# ---------------------------------------------------------------------------
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${C_YELLOW}${C_BOLD}  Jangan lupa tambahkan ke hosts file:${C_RESET}"
echo ""

if [[ "$OS" == "Darwin" ]] || [[ "$OS" == "Linux" ]]; then
    echo -e "  ${C_DIM}File: /etc/hosts${C_RESET}"
    echo ""
    echo -e "    ${C_CYAN}echo '127.0.0.1 ${DOMAIN}' | sudo tee -a /etc/hosts${C_RESET}"
else
    echo -e "  ${C_DIM}File: C:\\Windows\\System32\\drivers\\etc\\hosts  (buka Notepad as Admin)${C_RESET}"
    echo ""
    echo -e "    ${C_CYAN}127.0.0.1   ${DOMAIN}${C_RESET}"
    echo ""
    echo -e "  ${C_DIM}Atau via PowerShell (Admin):${C_RESET}"
    echo -e "    ${C_CYAN}Add-Content C:\\Windows\\System32\\drivers\\etc\\hosts '127.0.0.1 ${DOMAIN}'${C_RESET}"
fi

echo ""
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${C_GREEN}${C_BOLD}  Setelah trust CA + hosts file:${C_RESET}"
echo -e "  ${ARROW} Buka browser → ${C_CYAN}${C_BOLD}https://${DOMAIN}${C_RESET}"
echo -e "  ${ARROW} Vite HMR     → ${C_CYAN}${C_BOLD}http://localhost:${VITE_PORT:-5173}${C_RESET}"
echo ""
echo -e "  ${C_DIM}CA cert tidak perlu di-extract ulang — tersimpan di Docker volume.${C_RESET}"
echo -e "  ${C_DIM}Team member lain: jalankan script ini di mesin masing-masing.${C_RESET}"
echo ""
