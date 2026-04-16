# ──────────────────────────────────────────────────────────────
# run-tests.ps1 — deterministic Jest runner with structured output
# Usage:  powershell -File .github/skills/run-tests/run-tests.ps1 [optional test path]
# ──────────────────────────────────────────────────────────────
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$TestPaths
)

$ErrorActionPreference = 'Stop'

# Resolve project root (three levels up from .github/skills/run-tests/)
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir '..\..\..') | Select-Object -ExpandProperty Path
Set-Location $ProjectRoot

# Ensure node_modules exist
if (-not (Test-Path 'node_modules')) {
    Write-Error "node_modules not found. Run 'npm install' first."
    exit 2
}

# Build command
$JestArgs = @('jest', '--verbose', '--no-cache')
if ($TestPaths.Count -gt 0) {
    $JestArgs += '--'
    $JestArgs += $TestPaths
}

# Run Jest, capture output and exit code
$JestOutput = & npx @JestArgs 2>&1 | Out-String
$JestExit   = $LASTEXITCODE

# Print full Jest output
Write-Host $JestOutput

# Parse counts from Jest summary line: "Tests:  X failed, Y passed, Z total"
$Total  = 0
$Passed = 0
$Failed = 0

if ($JestOutput -match '(\d+)\s+total') {
    $Total = [int]$Matches[1]
}
if ($JestOutput -match '(\d+)\s+passed') {
    $Passed = [int]$Matches[1]
}
if ($JestOutput -match '(\d+)\s+failed') {
    $Failed = [int]$Matches[1]
}

# Structured summary
Write-Host ''
Write-Host '=== TEST SUMMARY ==='
Write-Host "Total:   $Total"
Write-Host "Passed:  $Passed"
Write-Host "Failed:  $Failed"
Write-Host "Exit:    $JestExit"
Write-Host '===  END SUMMARY ==='

exit $JestExit
