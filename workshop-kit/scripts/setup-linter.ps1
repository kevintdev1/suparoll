# Migra un proyecto EXISTENTE de ESLint/Prettier a Biome (Windows / PowerShell).
# Para proyectos nuevos no hace falta: usa `create-next-app --biome`.
# Uso (desde la raíz del proyecto):  .\scripts\setup-linter.ps1 [-Yes]
param([switch]$Yes)
$ErrorActionPreference = "Stop"

function Step($m) { Write-Host "`n> $m" -ForegroundColor Cyan }
function Warn($m) { Write-Host "! $m" -ForegroundColor Yellow }
function Fail($m) { Write-Host "x $m" -ForegroundColor Red; exit 1 }
function Run([string]$exe, [string[]]$argv) {
    & $exe @argv
    if ($LASTEXITCODE -ne 0) { Fail "Falló: $exe $($argv -join ' ')" }
}

$helper = Join-Path $PSScriptRoot "biome-migrate.cjs"
if (-not (Test-Path "package.json")) { Fail "No hay package.json en el directorio actual. Ejecuta desde la raíz del proyecto." }
if (-not (Test-Path $helper)) { Fail "Falta $helper (debe estar junto a este script)." }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail "Node.js no está disponible en el PATH." }

Step "Detectando gestor de paquetes"
if (Test-Path "pnpm-lock.yaml") { $pm = "pnpm"; $rm = @("remove"); $add = @("add","-D","-E"); $biomeExe = "pnpm"; $biomeArgs = @("exec","biome") }
elseif (Test-Path "yarn.lock") { $pm = "yarn"; $rm = @("remove"); $add = @("add","-D","-E"); $biomeExe = "yarn"; $biomeArgs = @("biome") }
elseif ((Test-Path "bun.lock") -or (Test-Path "bun.lockb")) { $pm = "bun"; $rm = @("remove"); $add = @("add","-d","-E"); $biomeExe = "bunx"; $biomeArgs = @("biome") }
else { $pm = "npm"; $rm = @("uninstall"); $add = @("install","--save-dev","-E"); $biomeExe = "npx"; $biomeArgs = @("--no-install","biome") }
if (-not (Get-Command $pm -ErrorAction SilentlyContinue)) { Fail "Se detectó $pm por el lockfile, pero no está instalado." }
Write-Host "  $pm"

$deps = @(& node $helper deps | Where-Object { $_ })
$configs = @(& node $helper configs | Where-Object { $_ })

Step "Plan"
Write-Host "  Dependencias a eliminar: $(if ($deps.Count) { $deps -join ' ' } else { '(ninguna)' })"
Write-Host "  Archivos a eliminar:     $(if ($configs.Count) { $configs -join ' ' } else { '(ninguno)' })"
Write-Host "  Se instalará @biomejs/biome (versión exacta) y se ajustarán biome.json(c), package.json y .vscode/"
if (-not $Yes) {
    $answer = Read-Host "¿Continuar? [s/N]"
    if ($answer -notmatch '^[sSyY]$') { Write-Host "Cancelado. No se modificó nada."; exit 0 }
}

Step "Copia de seguridad"
$backup = ".linter-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backup | Out-Null
$toBackup = @("package.json","pnpm-lock.yaml","yarn.lock","bun.lock","bun.lockb","package-lock.json","biome.json","biome.jsonc") + $configs
foreach ($f in $toBackup) { if (Test-Path $f) { Copy-Item $f $backup } }
if (Test-Path ".vscode") { Copy-Item ".vscode" (Join-Path $backup ".vscode") -Recurse }
$ignoreLine = ".linter-backup-*/"
if (-not (Test-Path ".gitignore") -or -not (Select-String -Path ".gitignore" -SimpleMatch $ignoreLine -Quiet)) { Add-Content -Path ".gitignore" -Value "`n$ignoreLine" }
Write-Host "  $backup\ (ignorada en .gitignore; bórrala cuando confirmes que todo funciona)"

if ($deps.Count) { Step "Eliminando dependencias de ESLint/Prettier"; Run $pm ($rm + $deps) }
if ($configs.Count) {
    Step "Eliminando configuración de ESLint/Prettier"
    foreach ($f in $configs) { Remove-Item $f -Force; Write-Host "  - $f" }
}

Step "Instalando Biome"
Run $pm ($add + @("@biomejs/biome"))
Run $biomeExe ($biomeArgs + @("--version"))

if (-not (Test-Path "biome.json") -and -not (Test-Path "biome.jsonc")) {
    Step "Inicializando configuración"
    Run $biomeExe ($biomeArgs + @("init"))
}

Step "Configurando Biome, scripts y editor"
& node $helper configure
$configureStatus = $LASTEXITCODE
if ($configureStatus -eq 1) { Fail "La configuración falló." }

Step "Aplicando formato y correcciones seguras"
& $biomeExe @($biomeArgs + @("check","--write","."))
Step "Comprobación final (sin escribir)"
& $biomeExe @($biomeArgs + @("check","."))
$checkStatus = $LASTEXITCODE

Write-Host ""
if ($checkStatus -ne 0) { Warn "Biome quedó instalado, pero reporta diagnósticos que hay que corregir (no se ocultan)."; exit 1 }
if ($configureStatus -eq 2) { Warn "Migración aplicada con pasos manuales pendientes (ver arriba)."; exit 2 }
Write-Host "✓ Migración a Biome completada y verificada." -ForegroundColor Green
