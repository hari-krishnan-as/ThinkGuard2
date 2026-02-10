# Test backend endpoints
Write-Host "🔍 Testing Backend Endpoints"
Write-Host "=========================="

try {
    # Test health endpoint
    Write-Host "1. Testing health endpoint..."
    $healthResponse = Invoke-WebRequest -Uri "https://thinkguard1.onrender.com/api/health" -UseBasicParsing
    Write-Host "✅ Health endpoint: $($healthResponse.StatusCode)"
    Write-Host "📄 Response: $($healthResponse.Content)"
    
    # Test login endpoint
    Write-Host "`n2. Testing login endpoint..."
    $loginBody = @{
        email = "test@example.com"
        password = "test123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "https://thinkguard1.onrender.com/api/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Login endpoint: $($loginResponse.StatusCode)"
    Write-Host "📄 Response: $($loginResponse.Content)"
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
}
