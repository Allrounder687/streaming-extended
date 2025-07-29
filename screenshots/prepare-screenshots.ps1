# Hotstar Extended - Screenshot Preparation Script
# Helps prepare the environment for taking professional screenshots

param(
    [switch]$SetupDemo = $false,
    [switch]$OpenDemoPages = $false,
    [switch]$CheckExtension = $false,
    [switch]$CreateDirectories = $false
)

Write-Host "=====================================" -ForegroundColor Green
Write-Host "   Hotstar Extended Screenshot Prep" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

function Create-ScreenshotDirectories {
    Write-Host "Creating screenshot directory structure..." -ForegroundColor Cyan
    
    $directories = @(
        "screenshots/popup",
        "screenshots/options", 
        "screenshots/hotstar",
        "screenshots/store",
        "screenshots/misc",
        "screenshots/raw",
        "screenshots/edited"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "Created: $dir" -ForegroundColor Green
        } else {
            Write-Host "Exists: $dir" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

function Open-DemoPages {
    Write-Host "Opening demo pages for screenshots..." -ForegroundColor Cyan
    
    $demoPages = @(
        "screenshots/demo-hotstar-page.html",
        "screenshots/popup-demo.html"
    )
    
    foreach ($page in $demoPages) {
        if (Test-Path $page) {
            Write-Host "Opening: $page" -ForegroundColor Green
            Start-Process $page
            Start-Sleep 2
        } else {
            Write-Host "Not found: $page" -ForegroundColor Red
        }
    }
    Write-Host ""
}

function Check-ExtensionFiles {
    Write-Host "Checking extension files..." -ForegroundColor Cyan
    
    $requiredFiles = @(
        "manifest.json",
        "popup.html",
        "popup.js",
        "popup.css",
        "options.html",
        "options.js", 
        "options.css",
        "content.js",
        "background.js"
    )
    
    $allPresent = $true
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Host "✓ $file" -ForegroundColor Green
        } else {
            Write-Host "✗ $file" -ForegroundColor Red
            $allPresent = $false
        }
    }
    
    if ($allPresent) {
        Write-Host "`nAll extension files present!" -ForegroundColor Green
    } else {
        Write-Host "`nSome extension files are missing!" -ForegroundColor Red
    }
    Write-Host ""
}

function Show-ScreenshotTips {
    Write-Host "📸 Screenshot Tips:" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Browser Setup:" -ForegroundColor Cyan
    Write-Host "   - Use Chrome with 100% zoom" -ForegroundColor White
    Write-Host "   - Clear other extensions" -ForegroundColor White
    Write-Host "   - Use default theme" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Extension Setup:" -ForegroundColor Cyan
    Write-Host "   - Install in developer mode" -ForegroundColor White
    Write-Host "   - Test all features work" -ForegroundColor White
    Write-Host "   - Configure demo settings" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Screenshot Quality:" -ForegroundColor Cyan
    Write-Host "   - Use high resolution display" -ForegroundColor White
    Write-Host "   - Ensure good lighting" -ForegroundColor White
    Write-Host "   - Take multiple shots" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Store Requirements:" -ForegroundColor Cyan
    Write-Host "   - 1280x800 pixels minimum" -ForegroundColor White
    Write-Host "   - PNG format preferred" -ForegroundColor White
    Write-Host "   - Under 16MB file size" -ForegroundColor White
    Write-Host ""
}

function Show-Menu {
    Write-Host "Available Actions:" -ForegroundColor Cyan
    Write-Host "1. Create directory structure" -ForegroundColor White
    Write-Host "2. Open demo pages" -ForegroundColor White
    Write-Host "3. Check extension files" -ForegroundColor White
    Write-Host "4. Show screenshot tips" -ForegroundColor White
    Write-Host "5. Open screenshot checklist" -ForegroundColor White
    Write-Host "6. Build extension for testing" -ForegroundColor White
    Write-Host "7. Exit" -ForegroundColor White
    Write-Host ""
}

function Open-Checklist {
    $checklistPath = "screenshots/SCREENSHOT_CHECKLIST.md"
    if (Test-Path $checklistPath) {
        Write-Host "Opening screenshot checklist..." -ForegroundColor Green
        Start-Process $checklistPath
    } else {
        Write-Host "Checklist not found: $checklistPath" -ForegroundColor Red
    }
}

function Build-Extension {
    Write-Host "Building extension for testing..." -ForegroundColor Cyan
    
    if (Test-Path "package.json") {
        Write-Host "Running npm run build-extension..." -ForegroundColor Yellow
        npm run build-extension
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Extension built successfully!" -ForegroundColor Green
            Write-Host "Load the 'dist' folder in Chrome developer mode" -ForegroundColor Yellow
        } else {
            Write-Host "Build failed!" -ForegroundColor Red
        }
    } else {
        Write-Host "No package.json found. Make sure you're in the project root." -ForegroundColor Red
    }
}

# Handle command line parameters
if ($CreateDirectories) {
    Create-ScreenshotDirectories
}

if ($OpenDemoPages) {
    Open-DemoPages
}

if ($CheckExtension) {
    Check-ExtensionFiles
}

if ($SetupDemo) {
    Create-ScreenshotDirectories
    Check-ExtensionFiles
    Open-DemoPages
    Show-ScreenshotTips
    exit 0
}

# Interactive mode if no parameters
if (-not ($CreateDirectories -or $OpenDemoPages -or $CheckExtension -or $SetupDemo)) {
    do {
        Show-Menu
        $choice = Read-Host "Select an option (1-7)"
        
        switch ($choice) {
            "1" { 
                Create-ScreenshotDirectories
                Read-Host "Press Enter to continue"
            }
            "2" { 
                Open-DemoPages
                Read-Host "Press Enter to continue"
            }
            "3" { 
                Check-ExtensionFiles
                Read-Host "Press Enter to continue"
            }
            "4" { 
                Show-ScreenshotTips
                Read-Host "Press Enter to continue"
            }
            "5" { 
                Open-Checklist
                Read-Host "Press Enter to continue"
            }
            "6" { 
                Build-Extension
                Read-Host "Press Enter to continue"
            }
            "7" { 
                Write-Host "Happy screenshotting! 📸" -ForegroundColor Green
                exit 0 
            }
            default { 
                Write-Host "Invalid option. Please try again." -ForegroundColor Red
                Start-Sleep 2
            }
        }
        Clear-Host
        Write-Host "=====================================" -ForegroundColor Green
        Write-Host "   Hotstar Extended Screenshot Prep" -ForegroundColor Green
        Write-Host "=====================================" -ForegroundColor Green
        Write-Host ""
    } while ($true)
}

Write-Host "Screenshot preparation completed!" -ForegroundColor Green