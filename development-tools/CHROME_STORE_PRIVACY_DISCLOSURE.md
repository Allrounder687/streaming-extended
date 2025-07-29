# Chrome Web Store Privacy Disclosure for Streaming Extended

## Data Collection Analysis

Based on the extension's source code analysis, here are the accurate answers for the Chrome Web Store privacy disclosure form:

## ❌ DATA WE DO **NOT** COLLECT

### Personally Identifiable Information
**Answer: NO** - We do not collect names, addresses, email addresses, age, or identification numbers.

### Health Information  
**Answer: NO** - We do not collect heart rate data, medical history, symptoms, diagnoses, or procedures.

### Financial and Payment Information
**Answer: NO** - We do not collect transactions, credit card numbers, credit ratings, financial statements, or payment history.

### Authentication Information
**Answer: NO** - We do not collect passwords, credentials, security questions, or PINs.

### Personal Communications
**Answer: NO** - We do not collect emails, texts, or chat messages.

### Location
**Answer: NO** - We do not collect region, IP address, GPS coordinates, or location information.

### Web History
**Answer: NO** - We do not collect the list of web pages visited, page titles, or browsing history.

### User Activity
**Answer: NO** - We do not perform network monitoring, track clicks, mouse position, scroll, or keystroke logging.

## ✅ DATA WE **DO** COLLECT (Minimal Local Storage Only)

### Website Content
**Answer: YES** - We collect limited website content for functionality purposes.

**What we collect:**
- Movie/TV show titles from streaming pages (Netflix, Hotstar, Prime Video, Disney+, Hulu, Max)
- Skip button text and attributes for detection
- Video player state information (current time, duration) for skip timing

**How it's used:**
- Extract show/movie titles to fetch IMDB ratings
- Detect skip buttons (intro, credits, recap) for auto-skip functionality
- Determine optimal timing for skip actions
- Track session statistics (skips performed, time saved)

**Data handling:**
- All data is processed locally in the browser
- No data is transmitted to external servers except IMDB API requests
- Statistics are stored locally using Chrome's storage API
- No personal identification or tracking

## 🔒 Privacy Protection Details

### Local Storage Only
- All user preferences stored locally using Chrome's `chrome.storage.sync`
- Session statistics stored locally using Chrome's `chrome.storage.local`
- No cloud storage or external databases used
- Data syncs only across user's own Chrome instances when signed in

### External API Usage
- **OMDB API**: Used to fetch IMDB ratings for movies/shows
- **Data sent**: Only movie/show titles (e.g., "The Office", "Stranger Things")
- **Data received**: Public ratings information (IMDB score, genre, year)
- **No personal data**: No user identification sent to OMDB API

### No Tracking or Analytics
- No user behavior tracking
- No analytics or telemetry data collection
- No cross-site tracking
- No advertising or marketing data collection

### Minimal Permissions
- Extension only accesses streaming platform pages when active
- No access to other websites or browsing data
- No background data collection when not on streaming sites

## 📋 Summary for Chrome Web Store Form

**Question: What user data do you plan to collect from users now or in the future?**

**Answer: Website content only**

**Justification:**
"The extension collects minimal website content (movie/TV show titles, skip button elements, video timing) exclusively from supported streaming platforms (Netflix, Hotstar, Prime Video, Disney+, Hulu, Max) to provide auto-skip functionality and IMDB ratings. All data is processed locally, with only movie titles sent to the public OMDB API for ratings. No personal information, browsing history, or user tracking is performed."

## 🛡️ Privacy Policy Summary

**Data Collection:** Minimal website content from streaming platforms only
**Data Usage:** Auto-skip functionality and IMDB ratings display
**Data Storage:** Local browser storage only
**Data Sharing:** None (except public movie titles to OMDB API)
**User Control:** Full control via extension settings
**Data Retention:** Local storage only, user can clear anytime

## ✅ Compliance Statement

This extension is designed with privacy-first principles:
- Minimal data collection (only what's necessary for functionality)
- Local processing and storage
- No user tracking or profiling
- No data monetization
- Transparent about external API usage
- User has full control over all features

The extension complies with Chrome Web Store policies and privacy requirements by collecting only essential website content for its core functionality while maintaining user privacy and data security.