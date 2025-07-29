# 🔧 Troubleshooting Guide - Streaming Extended

## Common Issues and Solutions

### ❌ "Could not establish connection" Error

**Problem**: Console shows "Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist."

**Solutions**:
1. **Reload the extension**: Go to `chrome://extensions/`, find Streaming Extended, click the reload button
2. **Refresh the streaming page**: Press F5 or Ctrl+R on Netflix/Hotstar/etc.
3. **Check if you're on a supported platform**: Extension only works on Netflix, Hotstar, Prime Video, Disney+, Hulu, and Max
4. **Wait a moment**: Content script may still be loading, try again in a few seconds

### 🚫 Extension Not Working on Streaming Sites

**Problem**: No auto-skip functionality on streaming platforms

**Troubleshooting Steps**:
1. **Verify platform support**: Check if you're on a supported streaming site
2. **Check extension status**: Click the extension icon to see if it shows "Active on [Platform]"
3. **Enable the extension**: Make sure the master toggle is ON in the popup
4. **Check individual settings**: Verify auto-skip options are enabled for the content type
5. **Look for skip buttons**: Extension only works when skip buttons are present on the page

### ⌨️ Keyboard Shortcuts Not Working

**Problem**: Ctrl+Shift+S, Ctrl+Shift+N, or Ctrl+Shift+I don't work

**Solutions**:
1. **Check if extension is enabled**: Must be ON for shortcuts to work
2. **Verify you're on a supported platform**: Shortcuts only work on streaming sites
3. **Check for conflicts**: Other extensions or browser shortcuts might interfere
4. **Customize shortcuts**: Go to Options page to set different key combinations
5. **Focus the page**: Click on the video player area first, then try shortcuts

### 📊 Statistics Not Showing

**Problem**: Popup shows "No data yet" or zero statistics

**Causes & Solutions**:
1. **New installation**: Statistics start tracking after first use
2. **No skip activity**: Statistics only update when skips occur
3. **Storage issues**: Try refreshing the extension or reloading the page
4. **Platform detection**: Make sure you're using the extension on supported platforms

### 🎯 Skip Buttons Not Being Detected

**Problem**: Extension doesn't find or click skip buttons

**Troubleshooting**:
1. **Wait for buttons to appear**: Skip buttons only show during intros/credits
2. **Check button visibility**: Some buttons may be hidden or styled differently
3. **Try manual skip**: Use Ctrl+Shift+I to test if buttons are detectable
4. **Platform-specific issues**: Different platforms have different button styles
5. **Update selectors**: Platform may have changed their button design

### 🔄 Extension Stops Working After Page Navigation

**Problem**: Extension works initially but stops after navigating to different videos

**Solutions**:
1. **Single Page Application behavior**: Modern streaming sites don't fully reload pages
2. **Refresh the page**: Press F5 to reinitialize the extension
3. **Check console**: Look for any JavaScript errors
4. **Reload extension**: Go to chrome://extensions and reload Streaming Extended

## Platform-Specific Issues

### Netflix
- **Issue**: Skip buttons appear briefly and disappear
- **Solution**: Extension detects and clicks them automatically, this is normal behavior

### Hotstar
- **Issue**: Regional differences in button detection
- **Solution**: Extension supports multiple regions (IN, US, UK, CA, AU, SG)

### Prime Video
- **Issue**: Different layouts for movies vs TV shows
- **Solution**: Extension adapts to different content types automatically

### Disney+
- **Issue**: Skip buttons may be styled differently
- **Solution**: Extension uses multiple detection methods

## Advanced Troubleshooting

### Enable Debug Mode
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for "Streaming Extended" messages
4. Check for any error messages or warnings

### Check Extension Permissions
1. Go to `chrome://extensions/`
2. Find Streaming Extended
3. Click "Details"
4. Verify all permissions are granted
5. Check "Site access" is set to "On all sites" or specific streaming domains

### Reset Extension Data
1. Go to Options page
2. Click "Reset to Defaults" button
3. Or manually clear extension data:
   - Open DevTools
   - Go to Application tab
   - Clear Local Storage for the streaming site

### Manual Testing
1. **Test platform detection**: Check console for "Detected platform" message
2. **Test button detection**: Use Ctrl+Shift+I to manually trigger skip
3. **Test statistics**: Verify data is being saved in chrome://extensions > Streaming Extended > Storage

## Getting Help

### Before Reporting Issues
1. **Check this troubleshooting guide**
2. **Try the solutions above**
3. **Test on multiple platforms**
4. **Check browser console for errors**

### Reporting Bugs
Include this information:
- **Browser version**: Chrome version number
- **Extension version**: Found in popup (v2.0.0)
- **Streaming platform**: Which site you were using
- **Steps to reproduce**: What you were doing when the issue occurred
- **Console errors**: Any error messages from DevTools
- **Screenshots**: If applicable

### Feature Requests
- **Describe the feature**: What you'd like to see added
- **Use case**: Why this feature would be helpful
- **Platform specific**: If it's for a particular streaming service

## Performance Tips

### Optimize Extension Performance
1. **Close unused tabs**: Reduces memory usage
2. **Disable on non-streaming sites**: Extension only activates on supported platforms
3. **Clear old statistics**: Reset data if it becomes too large
4. **Update regularly**: Keep extension updated for best performance

### Browser Optimization
1. **Keep Chrome updated**: Latest version has best extension support
2. **Disable conflicting extensions**: Other video-related extensions may interfere
3. **Clear browser cache**: Occasionally clear cache and cookies
4. **Restart browser**: If extension becomes unresponsive

---

**Still having issues?** The extension includes comprehensive error handling and should work reliably across all supported platforms. Most issues are resolved by reloading the extension or refreshing the streaming page.