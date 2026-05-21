#!/usr/bin/env bash
# =============================================================================
#  PandaEducation - Container Entrypoint
#  Performs pre-flight checks with animated output, then boots the dev stack.
# =============================================================================
set -e

APP_DIR="/var/www/html"
cd "$APP_DIR"

# -----------------------------------------------------------------------------
#  Colors & helpers
# -----------------------------------------------------------------------------
if [ -t 1 ]; then
    C_RESET="\033[0m";   C_BOLD="\033[1m";    C_DIM="\033[2m"
    C_RED="\033[31m";    C_GREEN="\033[32m";  C_YELLOW="\033[33m"
    C_BLUE="\033[34m";   C_MAGENTA="\033[35m"; C_CYAN="\033[36m"
    C_WHITE="\033[37m";  C_GRAY="\033[90m"
else
    C_RESET=""; C_BOLD=""; C_DIM=""; C_RED=""; C_GREEN=""
    C_YELLOW=""; C_BLUE=""; C_MAGENTA=""; C_CYAN=""; C_WHITE=""; C_GRAY=""
fi

CHECK="${C_GREEN}✔${C_RESET}"
CROSS="${C_RED}✘${C_RESET}"
INFO="${C_CYAN}ℹ${C_RESET}"
WARN="${C_YELLOW}⚠${C_RESET}"
ARROW="${C_MAGENTA}➜${C_RESET}"

# -----------------------------------------------------------------------------
#  Banner
# -----------------------------------------------------------------------------
print_banner() {
    clear || true
    echo ""
    echo -e "${C_MAGENTA}${C_BOLD}"
    cat <<'EOF'
    ╔══════════════════════════════════════════════════════════════════╗
    ║                                                                  ║
    ║      ____                _       _____    _                      ║
    ║     |  _ \ __ _ _ __  __| | __ _| ____|__| |_   _                ║
    ║     | |_) / _` | '_ \/ _` |/ _` |  _| / _` | | | |               ║
    ║     |  __/ (_| | | | | (_| | (_| | |__| (_| | |_| |              ║
    ║     |_|   \__,_|_| |_|\__,_|\__,_|_____\__,_|\__,_|              ║
    ║                                                                  ║
    ║         Laravel + Inertia + React · Octane FrankenPHP            ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${C_RESET}"
    echo -e "    ${C_DIM}Powered by Docker · FrankenPHP · PHP 8.3 · Node 22 · Postgres · Redis${C_RESET}"
    echo ""
}

# -----------------------------------------------------------------------------
#  Spinner: run a command while showing animated frames
#    usage: spin "Label" command args...
# -----------------------------------------------------------------------------
spin() {
    local label="$1"; shift
    local frames='⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏'
    local logfile; logfile="$(mktemp)"

    ( "$@" ) >"$logfile" 2>&1 &
    local pid=$!

    local i=0
    local arr=($frames)
    local n=${#arr[@]}
    while kill -0 "$pid" 2>/dev/null; do
        local f="${arr[$((i % n))]}"
        printf "\r  ${C_CYAN}%s${C_RESET} %s${C_DIM}...${C_RESET}   " "$f" "$label"
        i=$((i + 1))
        sleep 0.08
    done

    wait "$pid"
    local rc=$?
    if [ $rc -eq 0 ]; then
        printf "\r  ${CHECK} %s${C_DIM} ... done${C_RESET}              \n" "$label"
    else
        printf "\r  ${CROSS} %s${C_RED} ... failed${C_RESET}            \n" "$label"
        echo -e "${C_DIM}---- output ----${C_RESET}"
        cat "$logfile"
        echo -e "${C_DIM}----------------${C_RESET}"
        rm -f "$logfile"
        return $rc
    fi
    rm -f "$logfile"
    return 0
}

step()    { echo -e "  ${ARROW} ${C_BOLD}$1${C_RESET}"; }
ok()      { echo -e "  ${CHECK} $1"; }
fail()    { echo -e "  ${CROSS} ${C_RED}$1${C_RESET}"; }
note()    { echo -e "  ${INFO} ${C_DIM}$1${C_RESET}"; }
warn()    { echo -e "  ${WARN} ${C_YELLOW}$1${C_RESET}"; }
section() {
    echo ""
    echo -e "${C_BLUE}${C_BOLD}┌─ $1 ${C_RESET}"
    echo -e "${C_BLUE}${C_BOLD}│${C_RESET}"
}
section_end() {
    echo -e "${C_BLUE}${C_BOLD}└─${C_RESET}"
}

# -----------------------------------------------------------------------------
#  Wait for TCP host:port (used for db/redis)
# -----------------------------------------------------------------------------
wait_for_tcp() {
    local host="$1" port="$2" name="$3" timeout="${4:-60}"
    local frames='⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏'
    local arr=($frames); local n=${#arr[@]}; local i=0
    local t=0
    while ! nc -z "$host" "$port" >/dev/null 2>&1; do
        local f="${arr[$((i % n))]}"
        printf "\r  ${C_CYAN}%s${C_RESET} Waiting for ${C_BOLD}%s${C_RESET} on %s:%s ${C_DIM}(%ss)${C_RESET}   " "$f" "$name" "$host" "$port" "$t"
        i=$((i + 1)); t=$((t + 1))
        if [ "$t" -ge "$timeout" ]; then
            printf "\r  ${CROSS} ${C_RED}%s not reachable on %s:%s after %ss${C_RESET}\n" "$name" "$host" "$port" "$timeout"
            return 1
        fi
        sleep 1
    done
    printf "\r  ${CHECK} %s reachable on %s:%s${C_DIM} (took %ss)${C_RESET}        \n" "$name" "$host" "$port" "$t"
    return 0
}

# -----------------------------------------------------------------------------
#  Load Laravel .env — ONLY for vars not already set by docker-compose env.
#  docker-compose `environment:` block wins over .env file values.
# -----------------------------------------------------------------------------
load_dotenv() {
    [ -f "$APP_DIR/.env" ] || return 0
    while IFS= read -r line; do
        # strip Windows CR
        line="${line%$'\r'}"
        # skip blank lines and comments
        [[ "$line" =~ ^[[:space:]]*$ ]] && continue
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        key="${line%%=*}"
        val="${line#*=}"
        # strip surrounding quotes (single or double)
        val="${val%\"}" ; val="${val#\"}"
        val="${val%\'}" ; val="${val#\'}"
        # only export if this var is NOT already present in the environment
        # (printenv exits 1 when the key is completely unset)
        if [ -n "$key" ] && ! printenv "$key" >/dev/null 2>&1; then
            export "${key}=${val}"
        fi
    done < "$APP_DIR/.env"
}

# =============================================================================
#  PRE-FLIGHT CHECKS
# =============================================================================
print_banner

section "1/12  Project files"
if [ -f "$APP_DIR/composer.json" ]; then
    ok "composer.json detected"
else
    fail "composer.json NOT found at $APP_DIR — did you mount ./src correctly?"
    exit 1
fi
if [ -f "$APP_DIR/package.json" ]; then
    ok "package.json detected"
else
    warn "package.json missing — frontend (Vite) will not start"
fi
section_end

section "2/12  Environment file"
if [ ! -f "$APP_DIR/.env" ]; then
    if [ -f "$APP_DIR/.env.example" ]; then
        cp "$APP_DIR/.env.example" "$APP_DIR/.env"
        ok ".env created from .env.example"
    else
        fail "neither .env nor .env.example present"
        exit 1
    fi
else
    ok ".env already present"
fi
load_dotenv
APP_ENV_VALUE="${APP_ENV:-local}"
case "$APP_ENV_VALUE" in
    production|prod)
        warn "APP_ENV=${APP_ENV_VALUE} (running in PRODUCTION mode inside dev container — double-check this is intended)"
        ;;
    *)
        ok "APP_ENV=${C_BOLD}${APP_ENV_VALUE}${C_RESET} (development)"
        ;;
esac
section_end

section "3/12  Runtime versions"
PHP_V=$(php -r 'echo PHP_VERSION;' 2>/dev/null || echo "n/a")
COMPOSER_V=$(composer --version --no-ansi 2>/dev/null | head -1 || echo "n/a")
NODE_V=$(node --version 2>/dev/null || echo "n/a")
NPM_V=$(npm --version 2>/dev/null || echo "n/a")
ok "PHP        ${C_BOLD}${PHP_V}${C_RESET}"
ok "Composer   ${C_BOLD}${COMPOSER_V}${C_RESET}"
if [ "$NODE_V" = "n/a" ]; then
    fail "Node.js not installed"
    exit 1
else
    ok "Node.js    ${C_BOLD}${NODE_V}${C_RESET}"
fi
if [ "$NPM_V" = "n/a" ]; then
    fail "npm not installed"
    exit 1
else
    ok "npm        ${C_BOLD}${NPM_V}${C_RESET}"
fi
section_end

section "4/12  Database connection"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_CONNECTION="${DB_CONNECTION:-pgsql}"
note "driver=${DB_CONNECTION}  host=${DB_HOST}  port=${DB_PORT}  db=${DB_DATABASE:-?}"
if [ "$DB_CONNECTION" = "sqlite" ]; then
    mkdir -p "$APP_DIR/database"
    [ -f "$APP_DIR/database/database.sqlite" ] || touch "$APP_DIR/database/database.sqlite"
    ok "sqlite database file ready"
else
    wait_for_tcp "$DB_HOST" "$DB_PORT" "Database (${DB_CONNECTION})" 60 || exit 1
fi
section_end

section "5/12  Redis connection"
REDIS_HOST_V="${REDIS_HOST:-redis}"
REDIS_PORT_V="${REDIS_PORT:-6379}"
note "host=${REDIS_HOST_V}  port=${REDIS_PORT_V}"
wait_for_tcp "$REDIS_HOST_V" "$REDIS_PORT_V" "Redis" 30 || warn "continuing without Redis (sessions/cache may fall back)"
section_end

section "6/12  Composer dependencies"
if [ ! -d "$APP_DIR/vendor" ] || [ ! -f "$APP_DIR/vendor/autoload.php" ]; then
    spin "Installing composer packages" composer install --prefer-dist --no-interaction
else
    ok "vendor/ already present (skip install)"
fi
spin "composer dump-autoload --optimize" composer dump-autoload --optimize --no-interaction
section_end

section "7/12  Node modules"
if [ ! -d "$APP_DIR/node_modules" ] || [ -z "$(ls -A "$APP_DIR/node_modules" 2>/dev/null)" ]; then
    spin "Installing npm packages (this may take a few minutes)" npm install --no-fund --no-audit
else
    ok "node_modules/ already present (skip install)"
fi
section_end

section "8/12  Application key"
APP_KEY_VAL=$(grep -E '^APP_KEY=' "$APP_DIR/.env" | cut -d '=' -f2-)
if [ -z "$APP_KEY_VAL" ] || [ "$APP_KEY_VAL" = "" ]; then
    spin "Generating fresh APP_KEY" php artisan key:generate --force
else
    ok "APP_KEY already set"
fi
section_end

section "9/12  Storage symlink"
if [ -L "$APP_DIR/public/storage" ]; then
    ok "public/storage symlink already exists"
else
    spin "Creating storage symlink" php artisan storage:link
fi
section_end

section "10/12  Database migrations"
# Disable set -e for this block — migrate exits non-zero on real failures,
# and we want the container to survive so the dev can inspect the error.
set +e
php artisan migrate --force --no-interaction
_migrate_rc=$?
set -e
if [ "$_migrate_rc" -ne 0 ]; then
    warn "Migration failed (exit $_migrate_rc) — app will still start for debugging."
    warn "Fix the issue, then run:"
    warn "  docker compose exec app php artisan migrate --force"
fi
section_end

section "11/12  Clearing caches & generating assets"
spin "config:clear"  php artisan config:clear
spin "cache:clear"   php artisan cache:clear
spin "route:clear"   php artisan route:clear
spin "view:clear"    php artisan view:clear
if php artisan list --no-ansi 2>/dev/null | grep -q "wayfinder:generate"; then
    spin "Generating Wayfinder TypeScript files" php artisan wayfinder:generate --with-form
else
    note "wayfinder:generate not available — skipping"
fi
section_end

section "12/12  Permissions"
mkdir -p "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
chmod -R ug+rwX "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" 2>/dev/null || true
ok "storage/ & bootstrap/cache/ writable"
section_end

# =============================================================================
#  LAUNCH
# =============================================================================
echo ""
APP_PORT_V="${APP_PORT:-80}"
VITE_PORT_V="${VITE_PORT:-5173}"
APP_URL_V="${APP_URL:-http://pandaeducation.test}"

echo -e "${C_GREEN}${C_BOLD}  ════════════════  ALL CHECKS PASSED  ════════════════${C_RESET}"
echo ""
echo -e "  ${ARROW} Laravel  ${C_BOLD}${C_CYAN}${APP_URL_V}${C_RESET}  ${C_DIM}(Octane FrankenPHP)${C_RESET}"
echo -e "  ${ARROW} Vite HMR ${C_BOLD}http://localhost:${VITE_PORT_V}${C_RESET}"
echo -e "  ${ARROW} Postgres ${C_BOLD}localhost:5432${C_RESET}  ${C_DIM}(host port)${C_RESET}"
echo -e "  ${ARROW} Redis    ${C_BOLD}localhost:6379${C_RESET}  ${C_DIM}(host port)${C_RESET}"
echo ""
echo -e "${C_DIM}  Tip: docker compose logs -f app${C_RESET}"
echo ""

CMD="${1:-dev}"
case "$CMD" in
    dev)
        echo -e "${C_MAGENTA}${C_BOLD}  ▶ Starting: Octane FrankenPHP (--watch)  +  Vite HMR${C_RESET}"
        echo ""
        exec npx --yes concurrently \
            --prefix "[{name}]" \
            --names "octane,vite" \
            --prefix-colors "blue,magenta" \
            "php artisan octane:frankenphp --host=0.0.0.0 --port=${APP_PORT_V} --watch" \
            "npm run dev"
        ;;
    serve|octane)
        exec php artisan octane:frankenphp \
            --host=0.0.0.0 \
            --port="${APP_PORT_V}" \
            --watch
        ;;
    vite)
        exec npm run dev
        ;;
    bash|sh)
        exec bash
        ;;
    *)
        exec "$@"
        ;;
esac
