@echo off
echo Converting SVG icons to PNG for Hotstar Extended...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if cairosvg is installed
python -c "import cairosvg" >nul 2>&1
if errorlevel 1 (
    echo Installing cairosvg...
    pip install cairosvg
    if errorlevel 1 (
        echo Error: Failed to install cairosvg
        pause
        exit /b 1
    )
)

REM Run the conversion script
python convert-icons.py

echo.
echo Done! Check the icons folder for the new PNG files.
pause