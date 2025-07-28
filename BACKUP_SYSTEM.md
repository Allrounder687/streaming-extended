# Backup System Documentation

## Overview
The Hotstar Extended project now includes a comprehensive backup system with multiple scripts for creating, managing, and restoring backups.

## Files Created

### 1. `backup-script.ps1` (PowerShell - Recommended)
Advanced backup script with compression and detailed options.

**Usage:**
```powershell
# Basic backup (compressed)
.\backup-script.ps1 -Compress

# Include node_modules
.\backup-script.ps1 -IncludeNodeModules -Compress

# Backup without compression
.\backup-script.ps1

# Custom backup location
.\backup-script.ps1 -BackupLocation "D:\Backups" -Compress
```

**Features:**
- Timestamped backup names
- Optional compression (ZIP format)
- Excludes unnecessary files (node_modules by default, logs, temp files)
- Creates backup manifest with file details
- Shows backup size and file count

### 2. `backup-script.bat` (CMD - Simple)
Basic backup script for systems without PowerShell.

**Usage:**
```cmd
backup-script.bat
```

**Features:**
- Simple file copying
- Creates timestamped folders
- Includes essential project files
- Creates backup info file

### 3. `restore-backup.ps1` (PowerShell)
Restores project from backup archives or folders.

**Usage:**
```powershell
# Restore from ZIP
.\restore-backup.ps1 -BackupPath "backup_20250728_211053.zip"

# Restore from folder
.\restore-backup.ps1 -BackupPath "backup_20250728_211053"

# Force restore (overwrite existing files)
.\restore-backup.ps1 -BackupPath "backup.zip" -Force
```

### 4. `backup-manager.ps1` (PowerShell - Interactive)
Interactive menu system for backup management.

**Usage:**
```powershell
.\backup-manager.ps1
```

**Features:**
- Create new backups with options
- List existing backups with details
- Restore from backup selection
- Delete old backups by age
- Backup scheduling guidance

## Current Backup Status

✅ **Full backup created:** `backup_20250728_211053.zip`
- Size: 0.16 MB (compressed)
- Files: 78 files
- Includes all source code, configurations, and documentation
- Excludes: node_modules, build artifacts, logs

## Backup Contents

The backup includes:
- All source files (*.js, *.ts, *.html, *.css)
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (*.md files)
- Icons and assets
- Extension files (manifest.json, background.js, content.js)
- Build configurations (vite.config.ts, etc.)
- Kiro settings and steering files

## Excluded from Backup

By default, these are excluded to keep backups small:
- `node_modules/` (can be restored with `npm install`)
- `.git/` (version control history)
- `backup_*` (existing backups)
- `*.log` (log files)
- `*.tmp` (temporary files)
- `dist/` (can be excluded, build artifacts)

## Best Practices

### Regular Backups
1. Create backups before major changes
2. Use compressed backups to save space
3. Keep multiple backup versions
4. Clean up old backups periodically

### Before Major Updates
```powershell
# Create a backup before making changes
.\backup-script.ps1 -Compress
```

### After Successful Changes
```powershell
# Create a milestone backup
.\backup-script.ps1 -Compress
```

### Restore Process
1. Use `restore-backup.ps1` to restore files
2. Run `npm install` to restore dependencies
3. Run `npm run build` to rebuild the project
4. Test the extension functionality

## Automation Ideas

### Scheduled Backups
Create a Windows scheduled task to run daily backups:
```cmd
powershell.exe -ExecutionPolicy Bypass -File "C:\path\to\project\backup-script.ps1" -Compress
```

### Pre-commit Hooks
Add backup creation to your development workflow:
```powershell
# Before committing major changes
.\backup-script.ps1 -Compress
git add .
git commit -m "Your commit message"
```

## Troubleshooting

### PowerShell Execution Policy
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Large Backups
If backups are too large:
- Exclude `dist/` folder: `.\backup-script.ps1 -IncludeDist:$false`
- Don't include `node_modules`: Default behavior
- Use compression: `-Compress` flag

### Restore Issues
- Ensure you have write permissions to the restore location
- Use `-Force` flag to overwrite existing files
- Check that the backup file/folder exists and is accessible

## Quick Reference

| Task | Command |
|------|---------|
| Create backup | `.\backup-script.ps1 -Compress` |
| List backups | `.\backup-manager.ps1` (option 2) |
| Restore backup | `.\restore-backup.ps1 -BackupPath "backup.zip"` |
| Interactive manager | `.\backup-manager.ps1` |
| Simple backup (CMD) | `backup-script.bat` |