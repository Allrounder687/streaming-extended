# Simple Screenshot Setup Script
Write-Host "Setting up screenshot environment..." -ForegroundColor Green

# Create directories
$directories = @(
    "screenshots/popup",
    "screenshots/options", 
    "screenshots/hotstar",
    "screenshots/store",
    "screenshots/misc"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

# Check extension files
$requiredFiles = @("manifest.json", "popup.html", "options.html", "content.js")
Write-Host "`nChecking extension files:" -ForegroundColor Cyan
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file" -ForegroundColor Red
    }
}

Write-Host "`nScreenshot environment ready!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Build extension: npm run build-extension" -ForegroundColor White
Write-Host "2. Load extension in Chrome developer mode" -ForegroundColor White
Write-Host "3. Open demo pages for screenshots" -ForegroundColor White
Write-Host "4. Follow the checklist in SCREENSHOT_CHECKLIST.md" -ForegroundColor White