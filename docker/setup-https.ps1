# =============================================================================
#  PandaEducation - HTTPS Setup (Windows PowerShell)
#  Jalankan sekali per mesin setelah `docker compose up`.
#
#  Usage:
#    .\docker\setup-https.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Definition
$certsDir   = Join-Path $scriptDir "certs"
$caFile     = Join-Path $certsDir "pandaeducation-dev-ca.crt"
$container  = "pandaeducation-app"
$caCaddy    = "/data/caddy/pki/authorities/local/root.crt"
$domain     = if ($env:APP_DOMAIN) { $env:APP_DOMAIN } else { "pandaeducation.test" }

function Write-Step($n, $msg) { Write-Host "`n[$n] " -ForegroundColor Cyan -NoNewline; Write-Host $msg -ForegroundColor White }
function Write-Ok($msg)       { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Fail($msg)     { Write-Host "  [!!] $msg" -ForegroundColor Red }
function Write-Note($msg)     { Write-Host "  --> $msg" -ForegroundColor DarkGray }

Write-Host ""
Write-Host "  ╔═══════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "  ║   PandaEducation  HTTPS Setup         ║" -ForegroundColor Magenta
Write-Host "  ╚═══════════════════════════════════════╝" -ForegroundColor Magenta

# ---------------------------------------------------------------------------
# 1. Cek container
# ---------------------------------------------------------------------------
Write-Step "1/4" "Cek container $container..."
$status = docker inspect $container --format "{{.State.Status}}" 2>$null
if ($status -ne "running") {
    Write-Fail "Container belum running."
    Write-Note "Jalankan dulu: docker compose up -d app"
    exit 1
}
Write-Ok "Container running"

# ---------------------------------------------------------------------------
# 2. Tunggu Caddy CA terbentuk
# ---------------------------------------------------------------------------
Write-Step "2/4" "Menunggu Caddy CA certificate terbentuk..."
$waited = 0
$maxWait = 60
while ($true) {
    $exists = docker exec $container test -f $caCaddy 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    if ($waited -ge $maxWait) {
        Write-Fail "CA cert belum terbentuk setelah ${maxWait}s."
        Write-Note "Cek log: docker compose logs app"
        exit 1
    }
    Write-Host "`r  Menunggu... ($waited s)  " -NoNewline
    Start-Sleep -Seconds 2
    $waited += 2
}
Write-Ok "CA cert ditemukan di container"

# ---------------------------------------------------------------------------
# 3. Copy CA cert ke host
# ---------------------------------------------------------------------------
Write-Step "3/4" "Menyimpan CA cert ke docker\certs\..."
if (-not (Test-Path $certsDir)) { New-Item -ItemType Directory -Path $certsDir | Out-Null }
docker cp "${container}:${caCaddy}" $caFile
Write-Ok "Tersimpan: $caFile"

# ---------------------------------------------------------------------------
# 4. Import ke Windows Trust Store
# ---------------------------------------------------------------------------
Write-Step "4/4" "Meng-import CA cert ke Windows Trusted Root..."
Write-Note "Butuh akses Administrator"

try {
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($caFile)
    $store = New-Object System.Security.Cryptography.X509Certificates.X509Store(
        [System.Security.Cryptography.X509Certificates.StoreName]::Root,
        [System.Security.Cryptography.X509Certificates.StoreLocation]::LocalMachine
    )
    $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
    $store.Add($cert)
    $store.Close()
    Write-Ok "CA cert berhasil ditambahkan ke Trusted Root (LocalMachine)"
} catch {
    Write-Host ""
    Write-Fail "Gagal import otomatis (butuh run as Administrator)."
    Write-Host ""
    Write-Host "  Cara manual — buka PowerShell sebagai Administrator:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    Import-Certificate -FilePath `"$caFile`" \" -ForegroundColor Cyan
    Write-Host "      -CertStoreLocation Cert:\LocalMachine\Root" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Atau: klik dua kali file .crt -> Install Certificate -> Local Machine -> Trusted Root CA" -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
# Hosts file
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "  Tambahkan ke hosts file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  File: C:\Windows\System32\drivers\etc\hosts" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    127.0.0.1   $domain" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Atau jalankan PowerShell (Admin):" -ForegroundColor DarkGray
Write-Host "    Add-Content C:\Windows\System32\drivers\etc\hosts '127.0.0.1 $domain'" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Setelah trust CA + hosts file:" -ForegroundColor Green
Write-Host "  --> Buka browser: https://$domain" -ForegroundColor Cyan
Write-Host ""
Write-Host "  CA cert di-persist di Docker volume — tidak perlu extract ulang." -ForegroundColor DarkGray
Write-Host "  Team member lain: jalankan script ini di mesin masing-masing." -ForegroundColor DarkGray
Write-Host ""
