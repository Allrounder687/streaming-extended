// IMDB Ratings Module for Streaming Extended
class IMDBRatings {
    constructor() {
        this.apiKey = 'e27bfcaa';
        this.baseUrl = 'https://www.omdbapi.com/';
        this.cache = new Map();
        this.ratingsContainer = null;
        this.currentTitle = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Initialize ratings display
        this.init();
    }

    init() {
        // Create ratings container
        this.createRatingsContainer();
        
        // Start monitoring for title changes
        this.startTitleMonitoring();
        
        // Add CSS styles
        this.addStyles();
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

        const styles = `
            .se-ratings-container {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                min-width: 200px;
                transition: all 0.3s ease;
            }

            .se-ratings-container:hover {
                background: rgba(0, 0, 0, 0.95);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
            }

            .se-rating-title {
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 15px;
                color: #fff;
                line-height: 1.3;
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .se-rating-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 6px 0;
                padding: 4px 0;
            }

            .se-rating-source {
                font-weight: 500;
                color: #ccc;
            }

            .se-rating-value {
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 13px;
            }

            .se-rating-imdb {
                background: #f5c518;
                color: #000;
            }

            .se-rating-rt {
                background: #fa320a;
                color: #fff;
            }

            .se-rating-metacritic {
                background: #ffcc33;
                color: #000;
            }

            .se-rating-loading {
                color: #888;
                font-style: italic;
                text-align: center;
                padding: 8px 0;
            }

            .se-rating-error {
                color: #ff6b6b;
                font-size: 12px;
                text-align: center;
                padding: 4px 0;
            }

            .se-rating-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: #ccc;
                cursor: pointer;
                font-size: 16px;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .se-rating-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .se-rating-year {
                color: #888;
                font-size: 12px;
                margin-left: 8px;
            }

            .se-rating-genre {
                color: #aaa;
                font-size: 11px;
                margin-top: 4px;
                opacity: 0.8;
            }

            /* Platform-specific positioning */
            .netflix .se-ratings-container {
                top: 80px;
                right: 30px;
            }

            .hotstar .se-ratings-container {
                top: 100px;
                right: 25px;
            }

            .primevideo .se-ratings-container {
                top: 90px;
                right: 35px;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .se-ratings-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    font-size: 13px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    startTitleMonitoring() {
        // Monitor for title changes every 2 seconds
        setInterval(() => {
            this.checkForTitleChange();
        }, 2000);

        // Also check immediately
        setTimeout(() => this.checkForTitleChange(), 1000);
    }

    checkForTitleChange() {
        const title = this.extractCurrentTitle();
        
        if (title && title !== this.currentTitle && title.length > 2) {
            this.currentTitle = title;
            this.fetchAndDisplayRatings(title);
        } else if (!title && this.ratingsContainer) {
            this.hideRatings();
        }
    }

    extractCurrentTitle() {
        // Platform-specific title extraction
        const hostname = window.location.hostname;
        
        if (hostname.includes('netflix.com')) {
            return this.extractNetflixTitle();
        } else if (hostname.includes('hotstar.com')) {
            return this.extractHotstarTitle();
        } else if (hostname.includes('primevideo.com')) {
            return this.extractPrimeVideoTitle();
        } else if (hostname.includes('disneyplus.com')) {
            return this.extractDisneyPlusTitle();
        } else if (hostname.includes('hulu.com')) {
            return this.extractHuluTitle();
        } else if (hostname.includes('max.com')) {
            return this.extractMaxTitle();
        }
        
        return null;
    }

    extractNetflixTitle() {
        // Try multiple selectors for Netflix
        const selectors = [
            'h1[data-uia="video-title"]',
            '.video-title h4',
            '.PlayerControlsNeo__title',
            '[data-uia="video-title"]',
            '.watch-video--title-text',
            'h1.title-text'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        // Fallback to document title
        const docTitle = document.title;
        if (docTitle && docTitle !== 'Netflix') {
            return this.cleanTitle(docTitle.replace(' - Netflix', ''));
        }
        
        return null;
    }

    extractHotstarTitle() {
        const selectors = [
            '.player-title',
            '.content-title',
            'h1.title',
            '.video-title',
            '[data-testid="title"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        return null;
    }

    extractPrimeVideoTitle() {
        const selectors = [
            '[data-testid="title"]',
            '.title',
            'h1[data-automation-id="title"]',
            '.av-detail-section h1',
            '.dv-node-dp-title'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        return null;
    }

    extractDisneyPlusTitle() {
        const selectors = [
            '[data-testid="hero-title"]',
            '.title-field',
            'h1.title',
            '.content-title'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        return null;
    }

    extractHuluTitle() {
        const selectors = [
            '[data-automationid="details-title"]',
            '.content-title',
            'h1.title'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        return null;
    }

    extractMaxTitle() {
        const selectors = [
            '[data-testid="title"]',
            '.content-title',
            'h1.title'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return this.cleanTitle(element.textContent.trim());
            }
        }
        
        return null;
    }

    cleanTitle(title) {
        // Remove common suffixes and clean up title
        return title
            .replace(/\s*-\s*(Netflix|Prime Video|Disney\+|Hulu|Max|Hotstar).*$/i, '')
            .replace(/\s*\|\s*.*$/, '')
            .replace(/\s*:\s*Season\s*\d+.*$/i, '')
            .replace(/\s*S\d+.*$/i, '')
            .replace(/\s*Episode\s*\d+.*$/i, '')
            .replace(/\s*E\d+.*$/i, '')
            .trim();
    }

    async fetchAndDisplayRatings(title) {
        if (!title || title.length < 2) return;

        // Check cache first
        const cacheKey = title.toLowerCase();
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < 3600000) { // 1 hour cache
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
                if (this.retryCount < this.maxRetries) {
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

    async fetchFromOMDB(title) {
        const url = `${this.baseUrl}?apikey=${this.apiKey}&t=${encodeURIComponent(title)}&plot=short`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
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

        this.ratingsContainer.innerHTML = `
            <button class="se-rating-close" onclick="this.parentElement.style.display='none'">×</button>
            <div class="se-rating-title">${this.truncateTitle(title)}</div>
            <div class="se-rating-loading">Loading ratings...</div>
        `;
        
        this.ratingsContainer.style.display = 'block';
    }

    displayRatings(data, title) {
        if (!this.ratingsContainer || !data) return;

        const ratings = this.parseRatings(data);
        
        let ratingsHTML = `
            <button class="se-rating-close" onclick="this.parentElement.style.display='none'">×</button>
            <div class="se-rating-title">
                ${this.truncateTitle(title)}
                ${data.Year ? `<span class="se-rating-year">(${data.Year})</span>` : ''}
            </div>
        `;

        if (ratings.length > 0) {
            ratings.forEach(rating => {
                ratingsHTML += `
                    <div class="se-rating-item">
                        <span class="se-rating-source">${rating.source}</span>
                        <span class="se-rating-value se-rating-${rating.class}">${rating.value}</span>
                    </div>
                `;
            });
            
            if (data.Genre) {
                ratingsHTML += `<div class="se-rating-genre">${data.Genre}</div>`;
            }
        } else {
            ratingsHTML += '<div class="se-rating-error">No ratings available</div>';
        }

        this.ratingsContainer.innerHTML = ratingsHTML;
        this.ratingsContainer.style.display = 'block';

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (this.ratingsContainer && this.ratingsContainer.style.display !== 'none') {
                this.ratingsContainer.style.opacity = '0.7';
            }
        }, 10000);
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

        this.ratingsContainer.innerHTML = `
            <button class="se-rating-close" onclick="this.parentElement.style.display='none'">×</button>
            <div class="se-rating-error">${message}</div>
        `;
        
        this.ratingsContainer.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideRatings();
        }, 5000);
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

// Export for use in content script
window.IMDBRatings = IMDBRatings;