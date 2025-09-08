Set-Location $PSScriptRoot\..
Write-Output "Building C++ backend..."
cmake -S backend -B backend/build
cmake --build backend/build --config Release
Write-Output "Starting backend binary (background)..."
if (Test-Path backend\build\riskit_server.exe) {
  Start-Process -FilePath backend\build\riskit_server.exe -NoNewWindow
} elseif (Test-Path backend/build/riskit_server) {
  Start-Process -FilePath backend/build/riskit_server -NoNewWindow
} else {
  Write-Output "Binary not found"
}
