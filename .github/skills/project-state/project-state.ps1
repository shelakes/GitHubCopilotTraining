# ──────────────────────────────────────────────────────────────
# project-state.ps1 — deterministic project state collector
# Usage:  powershell -File .github/skills/project-state/project-state.ps1
# Must be run from the project root.
# ──────────────────────────────────────────────────────────────

$ErrorActionPreference = 'Stop'

# Resolve project root
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir '..\..\..') | Select-Object -ExpandProperty Path
Set-Location $ProjectRoot

# ── Helpers ──────────────────────────────────────────────────

function Get-LayerStats {
    param([string[]]$Patterns)
    $files = @()
    foreach ($pattern in $Patterns) {
        $files += Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    }
    $fileCount = $files.Count
    $lineCount = 0
    foreach ($f in $files) {
        $lineCount += (Get-Content $f.FullName -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
    }
    return @{ Files = $fileCount; Lines = $lineCount }
}

# ── Layer counts ─────────────────────────────────────────────

$data         = Get-LayerStats -Patterns @('data\*.js', 'data\*.json')
$business     = Get-LayerStats -Patterns @('js\*.js')
$presentation = Get-LayerStats -Patterns @('index.html')
$styles       = Get-LayerStats -Patterns @('css\*.css')

# Tests (may not exist yet)
$testFiles = @()
if (Test-Path 'tests') {
    $testFiles = Get-ChildItem -Path 'tests\*.test.js', 'tests\*.spec.js' -Recurse -ErrorAction SilentlyContinue
}
$testFileCount = $testFiles.Count
$testLines = 0
$testCaseCount = 0
foreach ($f in $testFiles) {
    $content = Get-Content $f.FullName -ErrorAction SilentlyContinue
    $testLines += ($content | Measure-Object -Line).Lines
    # Count test( and it( calls
    $testCaseCount += ($content | Select-String -Pattern '\b(test|it)\s*\(' -AllMatches |
        ForEach-Object { $_.Matches.Count } |
        Measure-Object -Sum).Sum
}
$tests = @{ Files = $testFileCount; Lines = $testLines }

# ── Todo progress ────────────────────────────────────────────

$todoTotal = 0
$todoDone  = 0
if (Test-Path 'developer_todo.md') {
    $todoContent = Get-Content 'developer_todo.md'
    # Count tasks by "## Task <n>" headings
    $todoTotal = ($todoContent | Select-String -Pattern '^## Task \d+' | Measure-Object).Count
    # Done = lines containing checkmarks or explicit done markers
    $todoDone = ($todoContent | Select-String -Pattern '(\u2705|\[x\]|Status:\s*Done|Status:\s*Complete)' -CaseSensitive:$false | Measure-Object).Count
}
$todoOpen = $todoTotal - $todoDone

# ── Environment signals ─────────────────────────────────────

$nodeModules = if (Test-Path 'node_modules') { 'installed' } else { 'missing' }

# Lint: try npx eslint if available, otherwise N/A
$lintErrors = 'N/A'
if ((Test-Path 'node_modules') -and (Test-Path 'node_modules\.bin\eslint*')) {
    try {
        $lintOutput = & npx eslint js/ --format compact 2>&1 | Out-String
        $errorMatches = [regex]::Matches($lintOutput, '\d+ error')
        if ($errorMatches.Count -gt 0) {
            $lintErrors = 0
            foreach ($m in $errorMatches) {
                $lintErrors += [int]($m.Value -replace ' error', '')
            }
        } else {
            $lintErrors = 0
        }
    } catch {
        $lintErrors = 'N/A'
    }
}

# ── Output ───────────────────────────────────────────────────

Write-Host ''
Write-Host '=== PROJECT STATE ==='
Write-Host ("Layer: data          Files: {0,-4} Lines: {1}" -f $data.Files, $data.Lines)
Write-Host ("Layer: business      Files: {0,-4} Lines: {1}" -f $business.Files, $business.Lines)
Write-Host ("Layer: presentation  Files: {0,-4} Lines: {1}" -f $presentation.Files, $presentation.Lines)
Write-Host ("Layer: styles        Files: {0,-4} Lines: {1}" -f $styles.Files, $styles.Lines)
Write-Host ("Layer: tests         Files: {0,-4} Lines: {1}" -f $tests.Files, $tests.Lines)
Write-Host '---'
Write-Host ("Test files:    {0}" -f $testFileCount)
Write-Host ("Test cases:    {0}" -f $testCaseCount)
Write-Host '---'
Write-Host ("Todo total:    {0}" -f $todoTotal)
Write-Host ("Todo done:     {0}" -f $todoDone)
Write-Host ("Todo open:     {0}" -f $todoOpen)
Write-Host '---'
Write-Host ("Node modules:  {0}" -f $nodeModules)
Write-Host ("Lint errors:   {0}" -f $lintErrors)
Write-Host '=== END STATE ==='
