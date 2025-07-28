# Technology Stack

## Build System
- **Vite** - Modern build tool and dev server
- **TypeScript** - Type-safe JavaScript with strict mode enabled
- **ESLint** - Code linting with React hooks and refresh plugins

## Frontend Stack
- **React 18** - UI library with StrictMode
- **React DOM 18** - DOM rendering
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing with Autoprefixer

## Browser Extension
- **Manifest V3** - Modern Chrome extension format
- **Content Scripts** - Injected into Hotstar pages
- **Service Worker** - Background script (background.js)
- **Chrome APIs** - Storage, scripting, activeTab permissions

## Development Tools
- **@types/chrome** - Chrome extension TypeScript definitions
- **@types/react** - React TypeScript definitions
- **typescript-eslint** - TypeScript ESLint integration

## Common Commands

### Development
```bash
npm run dev          # Start Vite dev server
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Building
```bash
npm run build                # Build with Vite
npm run build-extension      # Build extension package (includes manifest, icons, README)
```

### Project Structure Notes
- Extension files (popup.html, options.html, background.js, content.js) are in root
- React components in src/ folder
- Icons in icons/ folder
- Build output goes to dist/ folder