// IMDB Ratings Module for Streaming Extended

// Platform Strategy Pattern Implementation
class PlatformStrategy {
    constructor(name, selectors, titleCleaners = []) {
        this.name = name;
        this.selectors = selectors;
        this.titleCleaners = titleCleaners;
    }
    
    extractTitle() {
        for (const selector of this.selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        // Fallback to document title
        const docTitle = document.title;
        if (docTitle && !docTitle.includes(this.name)) {
            return this.cleanTitle(docTitle.replace(` - ${this.name}`, ''));
        }
        
        return null;
    }
    
    cleanTitle(title) {
        let cleaned = title;
        for (const cleaner of this.titleCleaners) {
            cleaned = cleaned.replace(cleaner.pattern, cleaner.replacement);
        }
        return cleaned.trim();
    }
}

class PlatformDetector {
    constructor() {
        this.strategies = new Map([
            ['netflix.com', new PlatformStrategy('Netflix', [
                'h1[data-uia="video-title"]',
                '.video-title h4',
                '.PlayerControlsNeo__title',
                '[data-uia="video-title"]',
                '.watch-video--title-text',
                'h1.title-text'
            ], [
                { pattern: /\s*-\s*Netflix.*$/i, replacement: '' },
                { pattern: /\s*\|\s*.*$/, replacement: '' },
                { pattern: /\s*:\s*Season\s*\d+.*$/i, replacement: '' },
                { pattern: /\s*S\d+.*$/i, replacement: '' }
            ])],
            
            ['hotstar.com', new PlatformStrategy('Hotstar', [
                '.player-title',
                '.content-title',
                'h1.title',
                '.video-title',
                '[data-testid="title"]'
            ])],
            
            ['primevideo.com', new PlatformStrategy('Prime Video', [
                '[data-testid="title"]',
                '.title',
                'h1[data-automation-id="title"]',
                '.av-detail-section h1',
                '.dv-node-dp-title'
            ])],
            
            ['disneyplus.com', new PlatformStrategy('Disney+', [
                '[data-testid="hero-title"]',
                '.title-field',
                'h1.title',
                '.content-title'
            ])],
            
            ['hulu.com', new PlatformStrategy('Hulu', [
                '[data-automationid="details-title"]',
                '.content-title',
                'h1.title'
            ])],
            
            ['max.com', new PlatformStrategy('Max', [
                '[data-testid="title"]',
                '.content-title',
                'h1.title'
            ])]
        ]);
    }
    
    extractCurrentTitle() {
        const hostname = window.location.hostname;
        for (const [domain, strategy] of this.strategies) {
            if (hostname.includes(domain)) {
                return strategy.extractTitle();
            }
        }
        return null;
    }
}

class IMDBRatings {
    constructor(config = {}) {
        // Configuration constants
        this.config = {
            INITIAL_CHECK_DELAY: 1000,
            CACHE_DURATION: 60 * 60 * 1000, // 1 hour
            ERROR_HIDE_DELAY: 5000,
            RATING_FADE_DELAY: 10000,
            POLLING_INTERVAL: 10000, // Reduced frequency
            DEBOUNCE_DELAY: 500,
            MAX_RETRIES: 3,
            API_TIMEOUT: 5000,
            ...config
        };

        // Core properties
        this.baseUrl = 'https://www.omdbapi.com/';
        this.cache = new Map();
        this.ratingsContainer = null;
        this.currentTitle = null;
        this.retryCount = 0;
        this.isInitialized = false;
        
        // Cleanup references
        this.titleObserver = null;
        this.fallbackInterval = null;
        this.platformDetector = new PlatformDetector();
        
        // Initialize API key securely
        this.initializeApiKey();
    }

    async initializeApiKey() {
        try {
            const result = await chrome.storage.sync.get(['omdbApiKey']);
            this.apiKey = result.omdbApiKey || 'e27bfcaa'; // Fallback key
        } catch (error) {
            console.warn('Failed to load API key from storage, using fallback');
            this.apiKey = 'e27bfcaa';
        }
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Ensure API key is loaded
            if (!this.apiKey) {
                await this.initializeApiKey();
            }
            
            // Create ratings container
            this.createRatingsContainer();
            
            // Start monitoring for title changes
            this.startTitleMonitoring();
            
            // Add CSS styles
            this.addStyles();
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize IMDB Ratings:', error);
        }
    }

    createRatingsContainer() {
        // Remove existing container if present
        const existing = document.getElementById('streaming-extended-ratings');
        if (existing) {
            existing.remove();
        }

        // Create new ratings container
        this.ratingsContainer = document.createElement('div');
        this.ratingsContainer.id = 'streaming-extended-ratings';
        this.ratingsContainer.className = 'se-ratings-container';
        
        // Initially hidden
        this.ratingsContainer.style.display = 'none';
        
        document.body.appendChild(this.ratingsContainer);
    }

    addStyles() {
        const styleId = 'streaming-extended-ratings-styles';
        if (document.getElementById(styleId)) return;

        try {
            // Try to load external CSS file if available (for extension context)
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                const link = document.createElement('link');
                link.id = styleId;
                link.rel = 'stylesheet';
                link.href = chrome.runtime.getURL('styles/imdb-ratings.css');
                document.head.appendChild(link);
            } else {
                // Fallback to inline styles for development/testing
                this.addInlineStyles(styleId);
            }
        } catch (error) {
            console.warn('Failed to load external CSS, using inline styles:', error);
            this.addInlineStyles(styleId);
        }
    }

    addInlineStyles(styleId) {
        // Minimal inline styles as fallback
        const styles = `
            .se-ratings-container {
                position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.9);
                color: white; padding: 12px 16px; border-radius: 8px; z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px; min-width: 200px; transition: all 0.3s ease;
            }
            .se-rating-title { font-weight: 600; margin-bottom: 8px; }
            .se-rating-item { display: flex; justify-content: space-between; margin: 6px 0; }
            .se-rating-close { position: absolute; top: 8px; right: 8px; background: none;
                border: none; color: #ccc; cursor: pointer; }
            .se-rating-imdb { background: #f5c518; color: #000; padding: 2px 8px; border-radius: 4px; }
            .se-rating-rt { background: #fa320a; color: #fff; padding: 2px 8px; border-radius: 4px; }
            .se-rating-metacritic { background: #ffcc33; color: #000; padding: 2px 8px; border-radius: 4px; }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    startTitleMonitoring() {
        // Use MutationObserver for efficient DOM watching
        this.titleObserver = new MutationObserver(
            this.debounce(() => this.checkForTitleChange(), this.config.DEBOUNCE_DELAY)
        );
        
        this.titleObserver.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['title']
        });
        
        // Fallback polling with longer interval
        this.fallbackInterval = setInterval(() => {
            this.checkForTitleChange();
        }, this.config.POLLING_INTERVAL);

        // Initial check
        setTimeout(() => this.checkForTitleChange(), this.config.INITIAL_CHECK_DELAY);
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    cleanup() {
        if (this.titleObserver) {
            this.titleObserver.disconnect();
            this.titleObserver = null;
        }
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
    }

    checkForTitleChange() {
        const title = this.platformDetector.extractCurrentTitle();
        
        if (title && title !== this.currentTitle && title.length > 2) {
            this.currentTitle = title;
            this.fetchAndDisplayRatings(title);
        } else if (!title && this.ratingsContainer) {
            this.hideRatings();
        }
    }



    async fetchAndDisplayRatings(title) {
        if (!title || title.length < 2) return;

        // Check cache first
        const cacheKey = title.toLowerCase();
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.config.CACHE_DURATION) {
                this.displayRatings(cachedData.data, title);
                return;
            }
        }

        // Show loading state
        this.showLoading(title);

        try {
            const data = await this.fetchFromOMDB(title);
            
            if (data && data.Response === 'True') {
                // Cache the result
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
                
                this.displayRatings(data, title);
                this.retryCount = 0;
            } else {
                // Try alternative search if first attempt fails
                if (this.retryCount < this.config.MAX_RETRIES) {
                    this.retryCount++;
                    const alternativeTitle = this.getAlternativeTitle(title);
                    if (alternativeTitle !== title) {
                        setTimeout(() => this.fetchAndDisplayRatings(alternativeTitle), 1000);
                        return;
                    }
                }
                
                this.showError('No ratings found');
                this.retryCount = 0;
            }
        } catch (error) {
            console.error('OMDB API Error:', error);
            this.showError('Failed to load ratings');
        }
    }

    async fetchFromOMDB(title, retryCount = 0) {
        const maxRetries = 3;
        const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.API_TIMEOUT);
            
            const url = `${this.baseUrl}?apikey=${this.apiKey}&t=${encodeURIComponent(title)}&plot=short`;
            const response = await fetch(url, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            if (retryCount < maxRetries && error.name !== 'AbortError') {
                console.warn(`OMDB API retry ${retryCount + 1}/${maxRetries}:`, error.message);
                await this.delay(retryDelay);
                return this.fetchFromOMDB(title, retryCount + 1);
            }
            throw error;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getAlternativeTitle(title) {
        // Try removing common words that might interfere with search
        return title
            .replace(/\s*(The|A|An)\s+/i, '')
            .replace(/\s*\(.*\)/, '')
            .replace(/\s*:.*$/, '')
            .trim();
    }

    showLoading(title) {
        if (!this.ratingsContainer) return;

        // Clear existing content
        this.ratingsContainer.innerHTML = '';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'se-rating-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.hideRatings());
        
        // Create title element
        const titleElement = document.createElement('div');
        titleElement.className = 'se-rating-title';
        titleElement.textContent = this.truncateTitle(title);
        
        // Create loading element
        const loadingElement = document.createElement('div');
        loadingElement.className = 'se-rating-loading';
        loadingElement.textContent = 'Loading ratings...';
        
        // Append elements
        this.ratingsContainer.appendChild(closeButton);
        this.ratingsContainer.appendChild(titleElement);
        this.ratingsContainer.appendChild(loadingElement);
        
        this.ratingsContainer.style.display = 'block';
    }

    displayRatings(data, title) {
        if (!this.ratingsContainer || !data) return;

        const ratings = this.parseRatings(data);
        
        // Clear existing content
        this.ratingsContainer.innerHTML = '';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'se-rating-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.hideRatings());
        
        // Create title container
        const titleContainer = document.createElement('div');
        titleContainer.className = 'se-rating-title';
        titleContainer.textContent = this.truncateTitle(title);
        
        if (data.Year) {
            const yearSpan = document.createElement('span');
            yearSpan.className = 'se-rating-year';
            yearSpan.textContent = `(${data.Year})`;
            titleContainer.appendChild(yearSpan);
        }
        
        // Append header elements
        this.ratingsContainer.appendChild(closeButton);
        this.ratingsContainer.appendChild(titleContainer);

        if (ratings.length > 0) {
            ratings.forEach(rating => {
                const ratingItem = document.createElement('div');
                ratingItem.className = 'se-rating-item';
                
                const sourceSpan = document.createElement('span');
                sourceSpan.className = 'se-rating-source';
                sourceSpan.textContent = rating.source;
                
                const valueSpan = document.createElement('span');
                valueSpan.className = `se-rating-value se-rating-${rating.class}`;
                valueSpan.textContent = rating.value;
                
                ratingItem.appendChild(sourceSpan);
                ratingItem.appendChild(valueSpan);
                this.ratingsContainer.appendChild(ratingItem);
            });
            
            if (data.Genre) {
                const genreDiv = document.createElement('div');
                genreDiv.className = 'se-rating-genre';
                genreDiv.textContent = data.Genre;
                this.ratingsContainer.appendChild(genreDiv);
            }
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'se-rating-error';
            errorDiv.textContent = 'No ratings available';
            this.ratingsContainer.appendChild(errorDiv);
        }

        this.ratingsContainer.style.display = 'block';

        // Auto-fade after configured delay
        setTimeout(() => {
            if (this.ratingsContainer && this.ratingsContainer.style.display !== 'none') {
                this.ratingsContainer.style.opacity = '0.7';
            }
        }, this.config.RATING_FADE_DELAY);
    }

    parseRatings(data) {
        const ratings = [];

        // IMDB Rating
        if (data.imdbRating && data.imdbRating !== 'N/A') {
            ratings.push({
                source: 'IMDB',
                value: `${data.imdbRating}/10`,
                class: 'imdb'
            });
        }

        // Parse additional ratings
        if (data.Ratings && Array.isArray(data.Ratings)) {
            data.Ratings.forEach(rating => {
                if (rating.Source === 'Rotten Tomatoes') {
                    ratings.push({
                        source: 'Rotten Tomatoes',
                        value: rating.Value,
                        class: 'rt'
                    });
                } else if (rating.Source === 'Metacritic') {
                    ratings.push({
                        source: 'Metacritic',
                        value: rating.Value,
                        class: 'metacritic'
                    });
                }
            });
        }

        return ratings;
    }

    truncateTitle(title) {
        return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }

    showError(message) {
        if (!this.ratingsContainer) return;

        // Clear existing content
        this.ratingsContainer.innerHTML = '';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'se-rating-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => this.hideRatings());
        
        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'se-rating-error';
        errorDiv.textContent = message;
        
        // Append elements
        this.ratingsContainer.appendChild(closeButton);
        this.ratingsContainer.appendChild(errorDiv);
        
        this.ratingsContainer.style.display = 'block';
        
        // Auto-hide error after configured delay
        setTimeout(() => {
            this.hideRatings();
        }, this.config.ERROR_HIDE_DELAY);
    }

    hideRatings() {
        if (this.ratingsContainer) {
            this.ratingsContainer.style.display = 'none';
        }
    }

    // Public method to manually refresh ratings
    refresh() {
        this.currentTitle = null;
        this.checkForTitleChange();
    }

    // Public method to toggle ratings display
    toggle() {
        if (this.ratingsContainer) {
            const isVisible = this.ratingsContainer.style.display !== 'none';
            this.ratingsContainer.style.display = isVisible ? 'none' : 'block';
        }
    }
}

// Auto-initialize when loaded in browser extension context
if (typeof window !== 'undefined') {
    // Export for use in content script
    window.IMDBRatings = IMDBRatings;
    window.PlatformDetector = PlatformDetector;
    window.PlatformStrategy = PlatformStrategy;
    
    // Auto-initialize if not in a module context
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.imdbRatingsInstance) {
                window.imdbRatingsInstance = new IMDBRatings();
                window.imdbRatingsInstance.initialize();
            }
        });
    } else {
        if (!window.imdbRatingsInstance) {
            window.imdbRatingsInstance = new IMDBRatings();
            window.imdbRatingsInstance.initialize();
        }
    }
}