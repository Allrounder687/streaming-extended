# 🎬 Streaming Extended

**The ultimate multi-platform streaming enhancement extension**

Automatically skip intros, credits, and recaps across **Netflix**, **Hotstar**, **Prime Video**, **Disney+**, **Hulu**, and **Max** for a seamless viewing experience.

## ✨ Features

### 🎯 **Multi-Platform Support**

- **Netflix** - Skip intros, credits, and auto-next episode
- **Hotstar** - Complete skip functionality with regional support
- **Prime Video** - Smart button detection and skipping
- **Disney+** - Intro and credit skipping
- **Hulu** - Comprehensive skip support
- **Max** - Auto-skip functionality

### ⌨️ **Keyboard Shortcuts**

- **Ctrl+Shift+S** - Toggle extension on/off
- **Ctrl+Shift+N** - Force next episode
- **Ctrl+Shift+I** - Manual skip intro/credits
- **Customizable hotkeys** in options page

### 📊 **Advanced Analytics**

- **Time saved tracking** with detailed statistics
- **Skip counters** by type (intro, credits, recap, manual)
- **Show tracking** - see your most watched content
- **Weekly/monthly usage reports**
- **Platform-specific insights**

### 🎨 **Enhanced User Experience**

- **Smart platform detection** with optimized selectors
- **Visual notifications** with platform badges
- **Professional dark theme** UI
- **Real-time statistics** in popup
- **Configurable delays** and timing

## 🚀 Installation

### Chrome Web Store (Recommended)

_Coming soon - extension will be published to Chrome Web Store_

### Manual Installation

1. Download the latest release or clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build-extension` to build the extension
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the `dist` folder

## 🎮 Usage

### Automatic Operation

The extension works automatically once installed:

- Detects your streaming platform
- Monitors for skip buttons
- Automatically clicks them based on your settings
- Tracks statistics and usage

### Manual Controls

- Use keyboard shortcuts for instant control
- Toggle settings in the popup (click extension icon)
- Access advanced options via the options page
- View detailed statistics and insights

### Supported Platforms

| Platform    | Skip Intro | Skip Credits | Next Episode | Show Tracking |
| ----------- | ---------- | ------------ | ------------ | ------------- |
| Netflix     | ✅         | ✅           | ✅           | ✅            |
| Hotstar     | ✅         | ✅           | ✅           | ✅            |
| Prime Video | ✅         | ✅           | ✅           | ✅            |
| Disney+     | ✅         | ✅           | ✅           | ✅            |
| Hulu        | ✅         | ✅           | ✅           | ✅            |
| Max         | ✅         | ✅           | ✅           | ✅            |

## ⚙️ Configuration

### Basic Settings

- **Auto-skip intros** - Automatically skip episode intros
- **Auto-skip credits** - Skip end credits
- **Auto-skip recaps** - Skip "previously on" segments
- **Auto next episode** - Automatically go to next episode
- **Skip delay** - Delay before auto-skipping (0-5 seconds)
- **Next episode delay** - Delay before next episode (instant to 10 seconds)

### Advanced Options

- **Keyboard shortcuts** - Customize hotkey combinations
- **Visual notifications** - Toggle skip indicators
- **Statistics tracking** - Enable/disable usage analytics
- **Platform-specific settings** - Per-platform customization

## 📈 Statistics & Analytics

Track your streaming habits with comprehensive analytics:

### Overview Stats

- **Total skips performed** across all platforms
- **Time saved** (formatted as hours/minutes/seconds)
- **Platform breakdown** showing usage per service
- **Session tracking** with daily counts

### Detailed Insights

- **Weekly/monthly trends** with skip counts
- **Most watched shows** with view counts
- **Skip type breakdown** (intro vs credits vs manual)
- **Platform comparison** and preferences

### Export & Privacy

- All data stored locally in your browser
- No external data collection or transmission
- Export statistics for personal use
- Clear data option available

## 🛠️ Development

### Prerequisites

- Node.js 16+ and npm
- Chrome browser for testing

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/streaming-extended.git
cd streaming-extended

# Install dependencies
npm install

# Build for development
npm run build

# Build extension package
npm run build-extension

# Run linting
npm run lint
```

### Project Structure

```
streaming-extended/
├── src/                    # React components (for development)
├── icons/                  # Extension icons (16px, 48px, 128px)
├── dist/                   # Built extension files
├── manifest.json           # Chrome extension manifest
├── content.js              # Main content script
├── background.js           # Service worker
├── popup.html/js/css       # Extension popup
├── options.html/js/css     # Options page
└── package.json           # Dependencies and scripts
```

### Architecture

- **Platform Handlers** - Modular platform-specific logic
- **Base Handler Class** - Shared functionality across platforms
- **Statistics Engine** - Comprehensive tracking and analytics
- **Keyboard Manager** - Customizable shortcut system
- **UI Components** - Modern popup and options interfaces

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding New Platforms

1. Create a new handler class extending `BasePlatformHandler`
2. Define platform-specific selectors and logic
3. Add platform detection in `PlatformDetector`
4. Update manifest permissions
5. Test thoroughly and submit PR

### Improving Existing Platforms

- Update selectors for better button detection
- Improve show name extraction
- Enhance platform-specific features
- Report and fix bugs

### Feature Requests

- Open an issue with detailed description
- Explain use case and benefits
- Provide mockups or examples if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all streaming platforms for providing great content
- Inspired by the need for seamless viewing experiences
- Built with modern web technologies and Chrome Extension APIs

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Feature Requests**: Use GitHub Discussions
- **Documentation**: Check the wiki for detailed guides

---

**Made with ❤️ for streaming enthusiasts worldwide**

_Streaming Extended - Skip the wait, enjoy the show!_
