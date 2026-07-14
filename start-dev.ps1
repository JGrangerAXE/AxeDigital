[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"

$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$installedNode = Get-Command node -ErrorAction SilentlyContinue

if (Test-Path -LiteralPath $bundledNode) {
    $node = $bundledNode
}
elseif ($installedNode) {
    $node = $installedNode.Source
}
else {
    throw "Node.js was not found. Install Node.js or restore the Codex bundled runtime."
}

$nextCli = Join-Path $PSScriptRoot "node_modules\next\dist\bin\next"

if (-not (Test-Path -LiteralPath $nextCli)) {
    throw "The Next.js CLI was not found. Restore the project's node_modules directory before starting development."
}

Push-Location $PSScriptRoot
try {
    & $node $nextCli dev --port $Port
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
