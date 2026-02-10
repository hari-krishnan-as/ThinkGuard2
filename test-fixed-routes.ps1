Write-Host "Testing fixed routes..."
$routes = @(
    "/api/users/register",
    "/api/users/login"
)

foreach ($route in $routes) {
    Write-Host "Testing: $route"
    try {
        $body = @{
            email = "test@example.com"
            password = "test123"
            username = "testuser"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "https://thinkguard1.onrender.com$route" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
        Write-Host "  ✅ Status: $($response.StatusCode)"
        Write-Host "  📄 Response: $($response.Content.Substring(0, 100))..."
    } catch {
        Write-Host "  ❌ Status: $($_.Exception.Response.StatusCode)"
    }
}
