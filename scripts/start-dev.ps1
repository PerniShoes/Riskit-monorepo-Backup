Set-Location $PSScriptRoot\..
Write-Output "Starting backend_mock and frontend dev server..."
Start-Process -FilePath node -ArgumentList 'backend_mock/server.js' -NoNewWindow
Start-Sleep -Seconds 1
Set-Location frontend
npm run dev
