# Keep the previous entry point using the shared branding renderer.
param([string]$PythonExecutable = 'python')

$ErrorActionPreference = 'Stop'
& $PythonExecutable (Join-Path $PSScriptRoot 'render-branding.py')
if ($LASTEXITCODE -ne 0) {
  throw "Branding renderer failed with exit code $LASTEXITCODE."
}
