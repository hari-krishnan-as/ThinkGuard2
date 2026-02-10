Write-Host "Testing backend health endpoint..."
try {
    $response = Invoke-WebRequest -Uri "https://thinkguard1.onrender.com/api/health" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Content: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
