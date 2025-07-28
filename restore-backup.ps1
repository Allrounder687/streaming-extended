# Hotstar Extended - Restore Backup Script
# Restores a project from a backup

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupPath,
    [string]$RestoreLocation = ".",
    [switch]$Force = $false
)

Write-Host "Hotstar Extended - Backup Restore" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if backup exists
if (-not (Test-Path $BackupPath)) {
    Write-Host "Error: Backup not found at $BackupPath" -ForegroundColor Red
    exit 1
}

# Determine if it's a zip file or directory
$isZip = $BackupPath.EndsWith(".zip")
$tempExtractPath = $null

if ($isZip) {
    Write-Host "Extracting backup archive..." -ForegroundColor Cyan
    $tempExtractPath = Join-Path $env:TEMP "hotstar_restore_$(Get-Random)"
    
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($BackupPath, $tempExtractPath)
    
    $BackupPath = $tempExtractPath
}

# Check for backup manifest
$manifestPath = Join-Path $BackupPath "backup-manifest.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath | ConvertFrom-Json
    Write-Host "Backup Information:" -ForegroundColor Yellow
    Write-Host "  Date: $($manifest.BackupDate)" -ForegroundColor White
    Write-Host "  Project: $($manifest.ProjectName)" -ForegroundColor White
    Write-Host "  Files: $($manifest.Files.Count)" -ForegroundColor White
    Write-Host ""
}

# Check if restore location has existing files
$existingFiles = Get-ChildItem $RestoreLocation -ErrorAction SilentlyContinue
if ($existingFiles -and -not $Force) {
    Write-Host "Warning: Restore location contains existing files." -ForegroundColor Yellow
    $response = Read-Host "Continue with restore? This may overwrite existing files. (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Restore cancelled." -ForegroundColor Red
        if ($tempExtractPath) { Remove-Item $tempExtractPath -Recurse -Force }
        exit 0
    }
}

# Restore files
Write-Host "Restoring files..." -ForegroundColor Cyan
$fileCount = 0

Get-ChildItem $BackupPath -Recurse | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $relativePath = $_.FullName.Substring($BackupPath.Length + 1)
        
        # Skip backup manifest
        if ($relativePath -eq "backup-manifest.json") {
            return
        }
        
        $destinationPath = Join-Path $RestoreLocation $relativePath
        $destinationDir = Split-Path $destinationPath -Parent
        
        if (-not (Test-Path $destinationDir)) {
            New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
        }
        
        Copy-Item $_.FullName $destinationPath -Force
        $fileCount++
        
        if ($fileCount % 10 -eq 0) {
            Write-Host "  Restored $fileCount files..." -ForegroundColor Gray
        }
    }
}

# Cleanup temp extraction
if ($tempExtractPath) {
    Remove-Item $tempExtractPath -Recurse -Force
}

Write-Host ""
Write-Host "Restore completed successfully!" -ForegroundColor Green
Write-Host "Files restored: $fileCount" -ForegroundColor Yellow
Write-Host "Location: $RestoreLocation" -ForegroundColor Yellow

# Suggest next steps
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm install' to restore dependencies" -ForegroundColor White
Write-Host "2. Run 'npm run build' to rebuild the project" -ForegroundColor White
Write-Host "3. Test the extension functionality" -ForegroundColor White