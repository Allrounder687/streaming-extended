@echo off
REM Hotstar Extended - Backup Script (CMD version)
REM Creates a timestamped backup of the entire project

setlocal enabledelayedexpansion

REM Get current timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%"
set "backupName=backup_%timestamp%"

echo Creating backup: %backupName%
echo.

REM Create backup directory
mkdir "%backupName%" 2>nul

REM Copy essential files
echo Copying project files...
xcopy "*.js" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.html" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.css" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.json" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.ts" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.md" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.bat" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.py" "%backupName%\" /Y /Q >nul 2>&1
xcopy "*.svg" "%backupName%\" /Y /Q >nul 2>&1

REM Copy directories
echo Copying directories...
if exist "src" xcopy "src" "%backupName%\src\" /E /I /Y /Q >nul 2>&1
if exist "icons" xcopy "icons" "%backupName%\icons\" /E /I /Y /Q >nul 2>&1
if exist "assets" xcopy "assets" "%backupName%\assets\" /E /I /Y /Q >nul 2>&1
if exist "utils" xcopy "utils" "%backupName%\utils\" /E /I /Y /Q >nul 2>&1
if exist ".kiro" xcopy ".kiro" "%backupName%\.kiro\" /E /I /Y /Q >nul 2>&1
if exist ".vscode" xcopy ".vscode" "%backupName%\.vscode\" /E /I /Y /Q >nul 2>&1
if exist "dist" xcopy "dist" "%backupName%\dist\" /E /I /Y /Q >nul 2>&1

REM Create backup info file
echo Backup created: %date% %time% > "%backupName%\backup-info.txt"
echo Project: Hotstar Extended >> "%backupName%\backup-info.txt"
echo Backup Name: %backupName% >> "%backupName%\backup-info.txt"

echo.
echo Backup completed: %backupName%
echo Check backup-info.txt for details
pause