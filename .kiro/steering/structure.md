# Project Structure

## Root Level Files
- **manifest.json** - Chrome extension manifest (V3)
- **background.js** - Service worker for extension background tasks
- **content.js** - Content script injected into Hotstar pages
- **content.css** - Styles for content script elements
- **popup.html/js/css** - Extension popup interface
- **options.html/js/css** - Advanced settings page
- **index.html** - Development HTML entry point

## Key Directories

### `/src/` - React Application
- **main.tsx** - React app entry point
- **App.tsx** - Main React component
- **index.css** - Global styles
- **vite-env.d.ts** - Vite type definitions

### `/icons/` - Extension Icons
- **icon16.png, icon48.png, icon128.png** - Extension icons for different sizes

### `/assets/` - Static Assets
- Contains additional assets and icons

### `/utils/` - Utility Functions
- Helper functions and shared utilities

## Configuration Files
- **vite.config.ts** - Vite build configuration for extension
- **tsconfig.json** - TypeScript project references
- **tsconfig.app.json** - App-specific TypeScript config
- **tsconfig.node.json** - Node-specific TypeScript config
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **eslint.config.js** - ESLint configuration
- **package.json** - Dependencies and scripts

## Build Output
- **dist/** - Generated build files (created by `npm run build-extension`)

## Architecture Notes
- Extension files (popup, options, background, content) are at root level
- React development files are in src/ for organized development
- Vite handles building both extension files and React components
- Content script runs on Hotstar pages, popup/options provide UI
- Background service worker handles extension lifecycle events