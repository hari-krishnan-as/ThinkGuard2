# Production build script
$env:REACT_APP_API_URL="https://thinkguard1.onrender.com/api"
$env:NODE_ENV="production"
Write-Host "Building with REACT_APP_API_URL=$env:REACT_APP_API_URL"
Write-Host "Building with NODE_ENV=$env:NODE_ENV"
npm run build
