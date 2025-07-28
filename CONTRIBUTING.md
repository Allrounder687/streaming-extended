# Contributing to Streaming Extended

Thank you for your interest in contributing to Streaming Extended! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Include detailed steps to reproduce the issue
- Specify your browser version and operating system
- Include screenshots or videos if helpful

### Suggesting Features
- Open a GitHub issue with the "enhancement" label
- Clearly describe the feature and its benefits
- Explain the use case and target audience
- Provide mockups or examples if applicable

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/streaming-extended.git
cd streaming-extended

# Install dependencies
npm install

# Build the extension
npm run build-extension

# Load in Chrome for testing
# Go to chrome://extensions/, enable Developer mode, click "Load unpacked"
```

#### Code Style
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and modular
- Use TypeScript types where applicable

#### Testing
- Test your changes on all supported platforms
- Verify keyboard shortcuts work correctly
- Check that statistics tracking functions properly
- Ensure no console errors or warnings
- Test with different browser sizes and zoom levels

## 🏗️ Architecture Overview

### Core Components

#### Platform Handlers
Each streaming platform has its own handler class:
- `NetflixHandler` - Netflix-specific logic
- `HotstarHandler` - Hotstar functionality
- `PrimeVideoHandler` - Prime Video support
- etc.

All handlers extend `BasePlatformHandler` which provides:
- Common skip functionality
- Statistics tracking
- Keyboard shortcut handling
- UI notification system

#### Content Script (`content.js`)
- Main entry point for the extension
- Detects current platform
- Initializes appropriate handler
- Manages global keyboard shortcuts
- Handles extension lifecycle events

#### Background Script (`background.js`)
- Service worker for Manifest V3
- Handles extension installation/updates
- Manages cross-tab communication
- Stores global settings

#### UI Components
- **Popup** (`popup.html/js/css`) - Quick access interface
- **Options** (`options.html/js/css`) - Detailed settings page
- Modern design with dark theme
- Real-time statistics display

### Data Flow
1. Content script detects platform
2. Initializes platform-specific handler
3. Handler monitors for skip buttons
4. Performs skips based on user settings
5. Updates statistics and UI
6. Syncs data across tabs

## 🎯 Adding New Platforms

### Step 1: Create Platform Handler
Create a new file for your platform handler:

```javascript
class YourPlatformHandler extends BasePlatformHandler {
    constructor() {
        super('YourPlatform');
        this.selectors = {
            skipIntro: '.skip-intro-button',
            skipCredits: '.skip-credits-button',
            nextEpisode: '.next-episode-button',
            showTitle: '.show-title'
        };
    }

    // Override methods as needed
    detectSkipButtons() {
        // Platform-specific detection logic
    }

    extractShowName() {
        // Extract show name for statistics
    }
}
```

### Step 2: Update Platform Detection
Add your platform to the detection logic in `content.js`:

```javascript
function detectPlatform() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('yourplatform.com')) {
        return new YourPlatformHandler();
    }
    // ... other platforms
}
```

### Step 3: Update Manifest
Add your platform's domain to `manifest.json`:

```json
{
    "content_scripts": [{
        "matches": [
            "*://*.yourplatform.com/*"
        ]
    }]
}
```

### Step 4: Test Thoroughly
- Test all skip functionality
- Verify show name extraction
- Check keyboard shortcuts
- Ensure statistics tracking works
- Test on different content types

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Screenshots/videos for UI changes

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on supported platforms
- [ ] No console errors
- [ ] Statistics tracking works

## Screenshots
(If applicable)
```

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing on multiple platforms
4. Approval and merge

## 🐛 Debugging Tips

### Common Issues
- **Buttons not detected**: Check selector accuracy
- **Statistics not updating**: Verify event handlers
- **Keyboard shortcuts not working**: Check event listeners
- **Extension not loading**: Verify manifest syntax

### Debugging Tools
- Chrome DevTools Console
- Extension Developer Tools
- Network tab for request monitoring
- Performance tab for optimization

### Logging
Use the built-in logging system:
```javascript
this.log('Debug message', 'info');
this.log('Error occurred', 'error');
```

## 📚 Resources

### Documentation
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

### Tools
- [Chrome Extension Source Viewer](https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin)
- [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks for major features

## 📞 Questions?

- Open a GitHub Discussion for general questions
- Use GitHub Issues for bug reports
- Contact maintainers for sensitive issues

Thank you for contributing to Streaming Extended! 🚀