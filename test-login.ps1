Write-Host "Testing login endpoint..."
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "https://thinkguard1.onrender.com/api/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Content: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
}
