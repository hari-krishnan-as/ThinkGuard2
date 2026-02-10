Write-Host "Checking available routes..."
$routes = @(
    "/api/health",
    "/api/register", 
    "/api/login",
    "/api/users/register",
    "/api/users/login"
)

foreach ($route in $routes) {
    Write-Host "Testing: $route"
    try {
        $response = Invoke-WebRequest -Uri "https://thinkguard1.onrender.com$route" -UseBasicParsing
        Write-Host "  ✅ Status: $($response.StatusCode)"
    } catch {
        Write-Host "  ❌ Status: $($_.Exception.Response.StatusCode)"
    }
}
