# IMDB Ratings Feature Documentation

## 🎬 Overview

The IMDB Ratings feature enhances your streaming experience by displaying movie and TV show ratings directly on streaming platforms. This feature uses your OMDB API key to fetch ratings from IMDB, Rotten Tomatoes, and Metacritic.

## ✨ Features

### **Multi-Source Ratings**
- **IMDB Ratings** - Industry standard movie ratings (e.g., 8.5/10)
- **Rotten Tomatoes** - Critics and audience scores (e.g., 95%)
- **Metacritic** - Professional critic scores (e.g., 85/100)

### **Smart Title Detection**
- Automatically detects what you're watching across all supported platforms
- Works with movies, TV shows, documentaries, and specials
- Handles different title formats and regional variations

### **Elegant Display**
- **Non-intrusive overlay** positioned in the corner of your screen
- **Dark theme** that matches streaming platform aesthetics
- **Auto-fade** after 10 seconds to avoid distraction
- **Click to close** or toggle visibility

### **Performance Optimized**
- **Intelligent caching** - ratings cached for 1 hour to reduce API calls
- **Retry logic** - attempts alternative title searches if first attempt fails
- **Minimal resource usage** - only fetches data when title changes

## 🚀 How It Works

### **Automatic Detection**
1. **Title Monitoring** - Continuously monitors page for title changes
2. **Platform-Specific Extraction** - Uses optimized selectors for each streaming service
3. **Title Cleaning** - Removes platform-specific suffixes and formatting
4. **API Query** - Searches OMDB database for matching content

### **Supported Platforms**
| Platform | Title Detection | Rating Display | Notes |
|----------|----------------|----------------|-------|
| Netflix | ✅ | ✅ | Works with all content types |
| Hotstar | ✅ | ✅ | Supports regional content |
| Prime Video | ✅ | ✅ | Handles Amazon originals |
| Disney+ | ✅ | ✅ | Works with Marvel, Star Wars, etc. |
| Hulu | ✅ | ✅ | Supports live TV and on-demand |
| Max (HBO) | ✅ | ✅ | HBO originals and movies |

## ⚙️ Configuration Options

### **Basic Settings (Popup)**
- **Enable/Disable** - Toggle IMDB ratings on/off
- **Quick Access** - Available in extension popup

### **Advanced Settings (Options Page)**
- **Display Position** - Choose corner for ratings overlay
  - Top Right (default)
  - Top Left
  - Bottom Right
  - Bottom Left
- **Auto-Hide Timer** - Control when ratings fade out
  - Never
  - After 5 seconds
  - After 10 seconds (default)
  - After 15 seconds

## 🔧 Technical Implementation

### **API Integration**
```javascript
// OMDB API Configuration
API Key: e27bfcaa (your key)
Base URL: https://www.omdbapi.com/
Rate Limit: 1000 requests/day (free tier)
```

### **Caching Strategy**
- **Memory Cache** - Stores ratings for current session
- **1-Hour TTL** - Refreshes data after 1 hour
- **Fallback Search** - Tries alternative titles if no match

### **Error Handling**
- **Graceful Degradation** - Extension works even if ratings fail
- **Retry Logic** - Attempts multiple search strategies
- **User Feedback** - Shows loading states and error messages

## 🎨 Visual Design

### **Rating Container**
```css
/* Modern dark theme with blur effect */
background: rgba(0, 0, 0, 0.9)
backdrop-filter: blur(10px)
border-radius: 8px
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)
```

### **Rating Sources**
- **IMDB** - Yellow badge (#f5c518)
- **Rotten Tomatoes** - Red badge (#fa320a)
- **Metacritic** - Yellow badge (#ffcc33)

### **Responsive Design**
- **Desktop** - Fixed position overlay
- **Mobile** - Adapts to smaller screens
- **Platform-specific** - Adjusts position per streaming service

## 📊 Usage Statistics

The IMDB ratings feature integrates with your existing statistics tracking:
- **Ratings Viewed** - Count of ratings displayed
- **API Calls Made** - Track API usage
- **Cache Hit Rate** - Monitor performance efficiency

## 🔒 Privacy & Security

### **Data Handling**
- **No Personal Data** - Only movie/TV titles are sent to OMDB
- **Local Caching** - Ratings stored locally in browser
- **No Tracking** - Extension doesn't track viewing habits
- **API Key Security** - Key stored securely in extension

### **Permissions**
- **OMDB API Access** - Required for fetching ratings
- **Local Storage** - For caching and settings
- **Content Script** - To detect titles and display ratings

## 🚀 Getting Started

### **Installation**
1. **Install Extension** - Load the updated extension package
2. **Automatic Activation** - IMDB ratings enabled by default
3. **Start Watching** - Ratings appear automatically when content loads

### **First Use**
1. **Navigate** to any supported streaming platform
2. **Start Playing** any movie or TV show
3. **Ratings Appear** in the top-right corner after 2-3 seconds
4. **Customize** position and timing in options if desired

## 🛠️ Troubleshooting

### **Common Issues**

**Ratings Not Appearing:**
- Check if IMDB ratings is enabled in popup
- Ensure you're on a supported streaming platform
- Wait 2-3 seconds for title detection
- Try refreshing the page

**Wrong Ratings Displayed:**
- Some titles may have multiple versions (remakes, regional variants)
- OMDB searches by title, may match different version
- This is expected behavior for ambiguous titles

**API Limit Reached:**
- Free OMDB API allows 1000 requests/day
- Caching reduces API calls significantly
- Consider upgrading OMDB plan for heavy usage

**Performance Issues:**
- Ratings are cached to minimize impact
- If experiencing slowdowns, disable feature temporarily
- Check browser console for error messages

### **Debug Information**
Enable browser console to see:
- Title detection logs
- API request/response details
- Cache hit/miss information
- Error messages and retry attempts

## 🔄 Future Enhancements

### **Planned Features**
- **Custom Rating Sources** - Add more rating providers
- **User Reviews** - Display user-generated ratings
- **Watchlist Integration** - Connect with external services
- **Rating History** - Track what you've rated
- **Recommendation Engine** - Suggest content based on ratings

### **Performance Improvements**
- **Predictive Caching** - Pre-fetch ratings for likely content
- **Background Sync** - Update cache in background
- **Offline Mode** - Show cached ratings when offline

## 📞 Support

### **Getting Help**
- **GitHub Issues** - Report bugs or request features
- **Documentation** - Check this guide and README
- **Community** - Join discussions for tips and tricks

### **Contributing**
- **Bug Reports** - Help improve title detection
- **Feature Requests** - Suggest new rating sources
- **Code Contributions** - Enhance the rating system

---

**The IMDB Ratings feature transforms your streaming experience by providing instant access to professional and audience ratings, helping you make informed viewing decisions without leaving your favorite streaming platform!** 🎬✨