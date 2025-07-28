# Changelog

All notable changes to Streaming Extended will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release preparation
- Comprehensive backup system
- GitHub repository setup

## [2.0.0] - 2025-01-28

### Added
- **Multi-platform support** for Netflix, Hotstar, Prime Video, Disney+, Hulu, and Max
- **Keyboard shortcuts** (Ctrl+Shift+S/N/I) with customizable hotkeys
- **Comprehensive statistics system** tracking skips, time saved, and show names
- **Advanced analytics** with weekly/monthly breakdowns
- **Smart platform detection** with optimized selectors
- **Performance optimizations** with caching and throttling
- **Video timing detection** to prevent premature next episode triggering
- **Context invalidation handling** for seamless extension updates
- **Modern UI** with dark theme and real-time statistics
- **Export functionality** for statistics data

### Changed
- **Complete rewrite** from single-platform to multi-platform architecture
- **Improved button detection** with platform-specific handlers
- **Enhanced show name extraction** for accurate statistics
- **Better error handling** and graceful degradation
- **Optimized performance** with reduced console logging
- **Updated manifest** to Manifest V3 with proper permissions

### Fixed
- **Excessive console logging** spam reduced with smart caching
- **Premature next episode triggering** with video timing validation
- **Infinite next episode loops** with proper cooldowns
- **Extension context invalidation** errors handled gracefully
- **Button detection failures** with improved selectors
- **Statistics accuracy** with better show name parsing

### Security
- **Minimal permissions** - only activeTab, storage, and scripting
- **No external requests** - all processing happens locally
- **Local storage only** - no data transmission
- **Domain restrictions** - only runs on supported streaming sites

## [1.0.0] - 2024-12-15

### Added
- Initial Hotstar-only version
- Basic auto-skip functionality for intros and credits
- Simple popup interface
- Basic settings and configuration
- Desktop notifications support

### Features
- Auto-skip intros on Hotstar
- Auto-skip credits on Hotstar
- Configurable skip delays
- Basic popup with on/off toggle
- Desktop notifications for skips

## Development Milestones

### Phase 1: Foundation (v1.0.0)
- ✅ Basic Hotstar support
- ✅ Core skip functionality
- ✅ Simple UI

### Phase 2: Multi-Platform (v2.0.0)
- ✅ Netflix support
- ✅ Prime Video support
- ✅ Disney+ support
- ✅ Hulu support
- ✅ Max support
- ✅ Unified architecture

### Phase 3: Advanced Features (v2.0.0)
- ✅ Keyboard shortcuts
- ✅ Statistics tracking
- ✅ Performance optimization
- ✅ Advanced analytics

### Phase 4: Polish & Release (Current)
- ✅ Comprehensive documentation
- ✅ Backup system
- ✅ GitHub repository
- 🔄 Chrome Web Store submission
- 🔄 User feedback integration

## Upcoming Features

### v2.1.0 (Planned)
- **Additional platforms**: Apple TV+, Paramount+, Peacock
- **Smart recommendations** based on viewing habits
- **Sync across devices** with cloud storage option
- **Advanced filters** for content types
- **Custom skip rules** per show/genre

### v2.2.0 (Planned)
- **Machine learning** for better button detection
- **Accessibility improvements** for screen readers
- **Internationalization** support for multiple languages
- **Advanced scheduling** for skip preferences
- **Integration APIs** for third-party tools

### v3.0.0 (Future)
- **Cross-browser support** (Firefox, Safari, Edge)
- **Mobile app companion** for remote control
- **Social features** for sharing statistics
- **Premium features** with advanced analytics
- **Enterprise version** for organizations

## Technical Debt & Improvements

### Performance
- ✅ Reduced console logging spam
- ✅ Implemented smart caching
- ✅ Added throttling mechanisms
- 🔄 Memory usage optimization
- 🔄 CPU usage monitoring

### Code Quality
- ✅ Modular architecture
- ✅ TypeScript integration
- ✅ ESLint configuration
- 🔄 Unit test coverage
- 🔄 Integration tests

### Documentation
- ✅ Comprehensive README
- ✅ Contributing guidelines
- ✅ Troubleshooting guide
- ✅ Backup system docs
- 🔄 API documentation

## Known Issues

### Current
- Some platforms may update their UI, requiring selector updates
- Occasional context invalidation during extension updates (handled gracefully)
- Statistics may not capture all edge cases for show name extraction

### Resolved
- ✅ Excessive console logging (v2.0.0)
- ✅ Premature next episode triggering (v2.0.0)
- ✅ Extension context invalidation errors (v2.0.0)
- ✅ Infinite next episode loops (v2.0.0)

## Migration Guide

### From v1.x to v2.x
1. **Backup your settings** - use the built-in backup system
2. **Uninstall old version** from Chrome extensions
3. **Install new version** following installation guide
4. **Reconfigure settings** - new options available
5. **Test functionality** on your preferred platforms

### Settings Migration
- Skip delays: Preserved automatically
- Notification preferences: Preserved automatically
- New features: Default settings applied
- Statistics: Fresh start (previous data not migrated)

## Support & Feedback

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser version and platform details
- Provide steps to reproduce the issue
- Attach screenshots or videos if helpful

### Feature Requests
- Open GitHub Discussions for feature ideas
- Explain the use case and benefits
- Vote on existing feature requests
- Contribute to implementation if possible

### Community
- GitHub Discussions for general questions
- Contributing guidelines for code contributions
- Regular updates and release notes
- Community feedback integration

---

**Legend:**
- ✅ Completed
- 🔄 In Progress
- 📋 Planned
- ❌ Cancelled/Deprecated