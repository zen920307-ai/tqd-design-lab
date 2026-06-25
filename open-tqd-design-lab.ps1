$ErrorActionPreference = 'Stop'

$projectPath = $PSScriptRoot
$url = 'http://127.0.0.1:5174/'
$npmPath = 'C:\Program Files\nodejs\npm.cmd'
$stdoutLog = Join-Path $projectPath 'shortcut-vite.out.log'
$stderrLog = Join-Path $projectPath 'shortcut-vite.err.log'

if (-not (Test-Path -LiteralPath $npmPath)) {
    throw "npm was not found at $npmPath"
}

$isRunning = Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
if (-not $isRunning) {
    Start-Process `
        -FilePath $npmPath `
        -ArgumentList 'run', 'dev', '--', '--port', '5174' `
        -WorkingDirectory $projectPath `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdoutLog `
        -RedirectStandardError $stderrLog

    for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
        Start-Sleep -Milliseconds 500
        if (Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue) {
            break
        }
    }
}

Start-Process $url
