@echo off
echo Setting up screenshot environment...

REM Create directories
mkdir screenshots\popup 2>nul
mkdir screenshots\options 2>nul
mkdir screenshots\hotstar 2>nul
mkdir screenshots\store 2>nul
mkdir screenshots\misc 2>nul

echo.
echo Screenshot directories created!
echo.
echo Next steps:
echo 1. Build extension: npm run build-extension
echo 2. Load extension in Chrome developer mode
echo 3. Open demo pages for screenshots
echo 4. Follow the checklist in SCREENSHOT_CHECKLIST.md
echo.
echo Demo pages available:
echo - screenshots\demo-hotstar-page.html
echo - screenshots\popup-demo.html
echo - screenshots\store-template.html
echo.
pause