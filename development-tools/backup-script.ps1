# Hotstar Extended - Backup Script
# Creates a timestamped backup of the entire project

param(
    [string]$BackupLocation = ".",
    [switch]$IncludeNodeModules = $false,
    [switch]$IncludeDist = $true,
    [switch]$Compress = $true
)

# Get current timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupName = "backup_$timestamp"
$backupPath = Join-Path $BackupLocation $backupName

Write-Host "Creating backup: $backupName" -ForegroundColor Green
Write-Host "Backup location: $backupPath" -ForegroundColor Yellow

# Create backup directory
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Define files and folders to exclude
$excludeItems = @(
    "node_modules",
    ".git",
    "backup_*",
    "*.log",
    "*.tmp"
)

if (-not $IncludeDist) {
    $excludeItems += "dist"
}

# Copy all files except excluded ones
Write-Host "Copying project files..." -ForegroundColor Cyan

Get-ChildItem -Path "." -Recurse | Where-Object {
    $item = $_
    $shouldExclude = $false
    
    foreach ($exclude in $excludeItems) {
        if ($item.Name -like $exclude -or $item.FullName -like "*\$exclude\*") {
            $shouldExclude = $true
            break
        }
    }
    
    return -not $shouldExclude
} | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    $destinationPath = Join-Path $backupPath $relativePath
    $destinationDir = Split-Path $destinationPath -Parent
    
    if (-not (Test-Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    }
    
    if (-not $_.PSIsContainer) {
        Copy-Item $_.FullName $destinationPath -Force
    }
}

# Include node_modules if requested
if ($IncludeNodeModules -and (Test-Path "node_modules")) {
    Write-Host "Including node_modules..." -ForegroundColor Cyan
    Copy-Item "node_modules" (Join-Path $backupPath "node_modules") -Recurse -Force
}

# Create backup manifest
$manifest = @{
    BackupDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    ProjectName = "Hotstar Extended"
    BackupVersion = "1.0"
    IncludeNodeModules = $IncludeNodeModules
    IncludeDist = $IncludeDist
    Files = @()
}

Get-ChildItem -Path $backupPath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($backupPath.Length + 1)
    $manifest.Files += @{
        Path = $relativePath
        Size = $_.Length
        LastModified = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    }
}

$manifest | ConvertTo-Json -Depth 3 | Out-File (Join-Path $backupPath "backup-manifest.json") -Encoding UTF8

# Compress if requested
if ($Compress) {
    Write-Host "Compressing backup..." -ForegroundColor Cyan
    $zipPath = "$backupPath.zip"
    
    # Use .NET compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($backupPath, $zipPath)
    
    # Remove uncompressed folder
    Remove-Item $backupPath -Recurse -Force
    
    Write-Host "Backup completed: $zipPath" -ForegroundColor Green
    Write-Host "Backup size: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Yellow
} else {
    Write-Host "Backup completed: $backupPath" -ForegroundColor Green
    $size = (Get-ChildItem $backupPath -Recurse | Measure-Object -Property Length -Sum).Sum
    Write-Host "Backup size: $([math]::Round($size / 1MB, 2)) MB" -ForegroundColor Yellow
}

Write-Host "Backup manifest created with $(($manifest.Files).Count) files" -ForegroundColor Cyan