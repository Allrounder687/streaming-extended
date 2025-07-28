// Content script for Streaming Extended (Multi-platform)
(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.streamingExtendedInitialized) {
    return;
  }
  window.streamingExtendedInitialized = true;

  // Platform handlers
  const SUPPORTED_PLATFORMS = {
    'hotstar.com': 'HotstarHandler',
    'netflix.com': 'NetflixHandler',
    'primevideo.com': 'PrimeVideoHandler',
    'disneyplus.com': 'DisneyPlusHandler',
    'hulu.com': 'HuluHandler',
    'max.com': 'MaxHandler'
  };

  // Base platform handler class
  class BasePlatformHandler {
    constructor() {
      this.platformName = 'Unknown';
      this.skipButtonSelectors = [];
      this.nextEpisodeSelectors = [];
      this.videoSelectors = ['video'];
    }

    findSkipButton() {
      return this.findElementBySelectors(this.skipButtonSelectors);
    }

    findNextEpisodeButton() {
      return this.findElementBySelectors(this.nextEpisodeSelectors);
    }

    findVideoElement() {
      return document.querySelector(this.videoSelectors.join(', '));
    }

    isWatchPage() {
      return this.findVideoElement() !== null;
    }

    extractShowName(title) {
      return title.split(' - ')[0].split(' | ')[0].trim();
    }

    findElementBySelectors(selectors) {
      for (const selector of selectors) {
        try {
          const element = document.querySelector(selector);
          if (element && this.isValidButton(element)) {
            return element;
          }
        } catch (e) {
          console.log(`Error with selector ${selector}:`, e);
        }
      }
      return null;
    }

    isValidButton(button) {
      if (!button) return false;

      const rect = button.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const style = window.getComputedStyle(button);
      const isDisplayed = style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        parseFloat(style.opacity) > 0;

      return isVisible && isDisplayed && !button.disabled;
    }
  }

  // Hotstar-specific handler
  class HotstarHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Hotstar';
      this.skipButtonSelectors = [
        'button[data-testid="skip-button"]',
        'button[class*="skip" i]',
        'button[aria-label*="skip" i]',
        '[role="button"][aria-label*="skip" i]',
        'button[class*="skip-intro"]',
        'button[class*="skipButton"]',
        'div[class*="skip"][role="button"]'
      ];
      this.nextEpisodeSelectors = [
        '[data-testid="auto-play-next"]',
        'button[class*="next" i]',
        'div[class*="next"][class*="episode"]',
        'div[class*="up-next"]',
        'button[aria-label*="next episode" i]'
      ];
    }

    isWatchPage() {
      const url = window.location.href.toLowerCase();
      return url.includes('/watch/') ||
        url.includes('/in/') ||
        url.includes('/us/') ||
        (url.includes('hotstar.com') && document.querySelector('video'));
    }

    extractShowName(title) {
      let cleanTitle = title
        .replace(/\s*-\s*Disney\+\s*Hotstar/i, '')
        .replace(/\s*\|\s*Disney\+\s*Hotstar/i, '')
        .replace(/\s*-\s*Hotstar/i, '')
        .replace(/\s*\|\s*Hotstar/i, '')
        .replace(/\s*Watch\s+/i, '')
        .replace(/\s*Season\s+\d+/i, '')
        .replace(/\s*Episode\s+\d+/i, '')
        .replace(/\s*S\d+E\d+/i, '')  // Remove S1E1 format
        .replace(/\s*\(\d{4}\)/i, '')  // Remove (2023)
        .trim();
      
      // Handle additional separators
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      
      return cleanTitle || 'Unknown Show';
    }
  }

  // Netflix-specific handler
  class NetflixHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Netflix';
      this.skipButtonSelectors = [
        'button[data-uia="player-skip-intro"]',
        'button[data-uia="player-skip-credits"]',
        'button[data-uia="next-episode"]',
        '.skip-credits button',
        '.skip-intro button',
        'button[aria-label*="Skip" i]'
      ];
      this.nextEpisodeSelectors = [
        'button[data-uia="next-episode"]',
        'button[data-uia="watch-video"]',
        '.next-episode button',
        'button[aria-label*="Next Episode" i]'
      ];
    }

    isWatchPage() {
      return window.location.pathname.includes('/watch/') &&
        document.querySelector('video');
    }

    extractShowName(title) {
      // Netflix titles can be in various formats:
      // "Show Name | Netflix"
      // "Show Name - Netflix" 
      // "Show Name: Season 1 | Netflix"
      // "Show Name (2023) | Netflix"
      
      let cleanTitle = title
        .replace(/\s*\|\s*Netflix$/i, '')  // Remove "| Netflix"
        .replace(/\s*-\s*Netflix$/i, '')   // Remove "- Netflix"
        .replace(/\s*:\s*Season\s+\d+/i, '') // Remove ": Season X"
        .replace(/\s*\(\d{4}\)/i, '')      // Remove "(2023)"
        .replace(/\s*-\s*Episode\s+\d+/i, '') // Remove "- Episode X"
        .trim();
      
      // If still contains separators, take the first part
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      
      return cleanTitle || 'Unknown Show';
    }
  }

  // Prime Video handler
  class PrimeVideoHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Prime Video';
      this.skipButtonSelectors = [
        'button[aria-label*="Skip" i]',
        '.skipElement button',
        'button[class*="skip" i]',
        '[data-testid*="skip"]'
      ];
      this.nextEpisodeSelectors = [
        'button[aria-label*="Next Episode" i]',
        '.nextUp button',
        'button[class*="next" i]',
        '[data-testid*="next"]'
      ];
    }

    isWatchPage() {
      return (window.location.pathname.includes('/detail/') ||
        window.location.pathname.includes('/player/')) &&
        document.querySelector('video');
    }

    extractShowName(title) {
      let cleanTitle = title
        .replace(/\s*-\s*Prime\s*Video/i, '')
        .replace(/\s*\|\s*Prime\s*Video/i, '')
        .replace(/\s*-\s*Amazon\s*Prime/i, '')
        .replace(/\s*Season\s+\d+/i, '')
        .replace(/\s*Episode\s+\d+/i, '')
        .replace(/\s*\(\d{4}\)/i, '')
        .trim();
      
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      
      return cleanTitle || 'Unknown Show';
    }
  }

  // Disney+ handler
  class DisneyPlusHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Disney+';
      this.skipButtonSelectors = [
        'button[data-testid="skip-intro-button"]',
        'button[data-testid="skip-credits-button"]',
        'button[aria-label*="Skip" i]',
        '.skip-intro button'
      ];
      this.nextEpisodeSelectors = [
        'button[data-testid="up-next-button"]',
        'button[aria-label*="Next Episode" i]',
        '.up-next button'
      ];
    }

    isWatchPage() {
      return window.location.pathname.includes('/video/') &&
        document.querySelector('video');
    }

    extractShowName(title) {
      let cleanTitle = title
        .replace(/\s*\|\s*Disney\+/i, '')
        .replace(/\s*-\s*Disney\+/i, '')
        .replace(/\s*Season\s+\d+/i, '')
        .replace(/\s*Episode\s+\d+/i, '')
        .replace(/\s*\(\d{4}\)/i, '')
        .trim();
      
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      
      return cleanTitle || 'Unknown Show';
    }
  }

  // Hulu handler
  class HuluHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Hulu';
      this.skipButtonSelectors = [
        'button[data-testid="SkipIntroButton"]',
        'button[aria-label*="Skip" i]',
        '.skip-intro button'
      ];
      this.nextEpisodeSelectors = [
        'button[data-testid="NextEpisodeButton"]',
        'button[aria-label*="Next Episode" i]'
      ];
    }

    isWatchPage() {
      return window.location.pathname.includes('/watch/') &&
        document.querySelector('video');
    }

    extractShowName(title) {
      let cleanTitle = title
        .replace(/\s*-\s*Hulu/i, '')
        .replace(/\s*\|\s*Hulu/i, '')
        .replace(/\s*Season\s+\d+/i, '')
        .replace(/\s*Episode\s+\d+/i, '')
        .replace(/\s*\(\d{4}\)/i, '')
        .trim();
      
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      
      return cleanTitle || 'Unknown Show';
    }
  }

  // Max handler
  class MaxHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Max';
      this.skipButtonSelectors = [
        'button[aria-label*="Skip" i]',
        '.skip-intro button'
      ];
      this.nextEpisodeSelectors = [
        'button[aria-label*="Next Episode" i]',
        '.next-episode button'
      ];
    }

    isWatchPage() {
      return window.location.pathname.includes('/player/') &&
        document.querySelector('video');
    }

    extractShowName(title) {
      let cleanTitle = title
        .replace(/\s*\|\s*Max/i, '')
        .replace(/\s*-\s*Max/i, '')
        .replace(/\s*\|\s*HBO\s*Max/i, '')
        .replace(/\s*Season\s+\d+/i, '')
        .replace(/\s*Episode\s+\d+/i, '')
        .replace(/\s*\(\d{4}\)/i, '')
        .trim();
      
      if (cleanTitle.includes(' | ')) {
        cleanTitle = cleanTitle.split(' | ')[0];
      }
      if (cleanTitle.includes(' - ')) {
        cleanTitle = cleanTitle.split(' - ')[0];
      }
      
      return cleanTitle || 'Unknown Show';
    }
  }

  // Platform detection and handler factory
  class PlatformDetector {
    static detectPlatform() {
      const hostname = window.location.hostname.toLowerCase();

      for (const [platform, handlerClass] of Object.entries(SUPPORTED_PLATFORMS)) {
        if (hostname.includes(platform)) {
          return PlatformDetector.createHandler(handlerClass);
        }
      }

      return new BasePlatformHandler(); // Fallback
    }

    static createHandler(handlerClassName) {
      switch (handlerClassName) {
        case 'HotstarHandler':
          return new HotstarHandler();
        case 'NetflixHandler':
          return new NetflixHandler();
        case 'PrimeVideoHandler':
          return new PrimeVideoHandler();
        case 'DisneyPlusHandler':
          return new DisneyPlusHandler();
        case 'HuluHandler':
          return new HuluHandler();
        case 'MaxHandler':
          return new MaxHandler();
        default:
          return new BasePlatformHandler();
      }
    }
  }

  class StreamingExtended {
    constructor() {
      // Detect platform and create appropriate handler
      this.platformHandler = PlatformDetector.detectPlatform();
      console.log(`Streaming Extended: Detected platform - ${this.platformHandler.platformName}`);

      this.settings = {
        extensionEnabled: true,
        autoSkipIntro: true,
        autoSkipCredits: true,
        autoSkipRecap: true,
        autoNextEpisode: true,
        skipDelay: 1000,
        nextEpisodeDelay: 5000, // Default to 5 seconds delay
        showNotifications: false,
        debugMode: false, // Add debug mode toggle
        shortcuts: {
          toggleExtension: 'ctrl+shift+s',
          forceNextEpisode: 'ctrl+shift+n',
          manualSkipIntro: 'ctrl+shift+i'
        }
      };

      this.isEnabled = true;
      this.observers = [];
      this.videoElements = new Map();
      this.videoCheckInterval = null;
      this.buttonCache = new Map();
      this.lastButtonSearch = 0;
      this.buttonCacheTimeout = 5000; // Increased from 2000ms to 5000ms
      this.actionQueue = [];
      this.isProcessingQueue = false;

      this.lastSkipTime = 0;
      this.lastNextEpisodeTime = 0;
      this.lastButtonCheck = 0;
      this.buttonCheckThrottle = 1000; // Throttle button checks to once per second
      this.nextEpisodeTimeout = null; // Track next episode timeout for cancellation
      this.currentUrl = window.location.href; // Track current page to detect episode changes
      this.videoTimingFailures = 0; // Track consecutive video timing failures
      this.processedButtons = new WeakSet();
      this.processedNextButtons = new WeakSet();

      // Statistics tracking
      this.statistics = {
        totalSkips: 0,
        introSkips: 0,
        creditSkips: 0,
        recapSkips: 0,
        manualSkips: 0,
        nextEpisodeClicks: 0,
        timeSavedSeconds: 0,
        sessionsToday: 0,
        lastSessionDate: null,
        mostWatchedShows: {},
        weeklyStats: {},
        monthlyStats: {}
      };

      // Initialize asynchronously
      this.initialize();
    }

    // Initialize the extension asynchronously
    async initialize() {
      try {
        await this.init();
        this.setupKeyboardShortcuts();
        this.loadStatistics();
      } catch (error) {
        console.error('Streaming Extended: Failed to initialize:', error);
      }
    }

    // Debug logging method
    debugLog(message, ...args) {
      if (this.settings.debugMode) {
        console.log(message, ...args);
      }
    }

    // Handle extension context invalidation
    setupContextInvalidationHandler() {
      // Check if chrome.runtime is available
      const checkContext = () => {
        try {
          if (!chrome.runtime || !chrome.runtime.id) {
            console.log('Streaming Extended: Extension context invalidated, cleaning up...');
            this.handleContextInvalidation();
            return false;
          }
          return true;
        } catch (error) {
          console.log('Streaming Extended: Extension context invalidated, cleaning up...');
          this.handleContextInvalidation();
          return false;
        }
      };

      // Check context periodically
      this.contextCheckInterval = setInterval(() => {
        if (!checkContext()) {
          clearInterval(this.contextCheckInterval);
        }
      }, 5000);

      // Also check before any chrome API calls
      this.isContextValid = checkContext;
    }

    handleContextInvalidation() {
      console.log('Streaming Extended: Handling context invalidation...');
      
      // Stop all monitoring
      this.stopMonitoring();
      
      // Clear all intervals and timeouts
      if (this.contextCheckInterval) {
        clearInterval(this.contextCheckInterval);
        this.contextCheckInterval = null;
      }
      
      if (this.nextEpisodeTimeout) {
        clearTimeout(this.nextEpisodeTimeout);
        this.nextEpisodeTimeout = null;
      }
      
      // Remove any UI elements
      const countdown = document.querySelector('.streaming-extended-countdown');
      if (countdown) {
        countdown.remove();
      }
      
      // Mark as disabled
      this.isEnabled = false;
      
      console.log('Streaming Extended: Cleanup complete. Please reload the page to reinitialize.');
    }

    // Check if video is near end or has ended
    isVideoNearEndOrEnded() {
      const video = this.platformHandler.findVideoElement();
      
      // If no video found, allow next episode (some platforms might not have detectable video)
      if (!video) {
        console.log('Streaming Extended: No video element found, allowing next episode check');
        return true;
      }
      
      // If video exists but no timing info, check if it's ended
      if (!video.duration || !video.currentTime) {
        const hasEnded = video.ended;
        console.log(`Streaming Extended: Video found but no timing info - Ended: ${hasEnded}`);
        return hasEnded;
      }

      const timeLeft = video.duration - video.currentTime;
      const isNearEnd = timeLeft <= 30; // Increased from 20 to 30 seconds for more flexibility
      const hasEnded = video.ended;
      
      console.log(`Streaming Extended: Video check - Duration: ${Math.round(video.duration)}s, Current: ${Math.round(video.currentTime)}s, Time left: ${Math.round(timeLeft)}s, Near end: ${isNearEnd}, Ended: ${hasEnded}`);
      
      return isNearEnd || hasEnded;
    }

    showNextEpisodeCountdown(delay) {
      const countdownElement = document.createElement('div');
      countdownElement.className = 'streaming-extended-countdown';
      countdownElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 999999;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border: 3px solid #00d4ff;
        box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
        backdrop-filter: blur(10px);
        min-width: 300px;
      `;

      let remainingTime = Math.ceil(delay / 1000);
      
      const updateCountdown = () => {
        countdownElement.innerHTML = `
          <div style="margin-bottom: 15px; font-size: 18px; color: #00d4ff;">
            🎬 ${this.platformHandler.platformName}
          </div>
          <div style="margin-bottom: 10px;">
            Next Episode in
          </div>
          <div style="font-size: 48px; color: #00d4ff; margin: 10px 0;">
            ${remainingTime}
          </div>
          <div style="font-size: 14px; color: #ccc; margin-top: 15px;">
            Press Ctrl+Shift+S to cancel
          </div>
        `;
        
        remainingTime--;
        
        if (remainingTime < 0) {
          if (countdownElement.parentNode) {
            countdownElement.parentNode.removeChild(countdownElement);
          }
        }
      };

      updateCountdown();
      document.body.appendChild(countdownElement);

      const countdownInterval = setInterval(updateCountdown, 1000);
      
      // Remove countdown after delay
      setTimeout(() => {
        clearInterval(countdownInterval);
        if (countdownElement.parentNode) {
          countdownElement.parentNode.removeChild(countdownElement);
        }
      }, delay);
    }

    async init() {
      await this.loadSettings();
      this.isEnabled = this.settings.extensionEnabled !== false;

      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
          if (message.action === 'setExtensionEnabled') {
            this.isEnabled = message.enabled;
            if (this.isEnabled) {
              this.startMonitoring();
              console.log('Streaming Extended: Extension enabled');
            } else {
              this.stopMonitoring();
              console.log('Streaming Extended: Extension disabled');
            }
            sendResponse({ success: true });
          } else if (message.action === 'getStatistics') {
            sendResponse({ statistics: this.getStatisticsSummary() });
          }
        } catch (error) {
          console.error('Streaming Extended: Error handling message:', error);
          sendResponse({ error: error.message });
        }
        return true; // Keep the message channel open for async responses
      });

      // Handle extension context invalidation
      console.log('Streaming Extended: About to call setupContextInvalidationHandler, this:', this);
      console.log('Streaming Extended: setupContextInvalidationHandler type:', typeof this.setupContextInvalidationHandler);
      this.setupContextInvalidationHandler();

      if (this.isEnabled) {
        this.startMonitoring();
      }

      if (chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes) => {
          for (let key in changes) {
            this.settings[key] = changes[key].newValue;
            if (key === 'extensionEnabled') {
              this.isEnabled = changes[key].newValue;
              if (this.isEnabled) {
                this.startMonitoring();
              } else {
                this.stopMonitoring();
              }
            }
          }
        });
      }

      console.log(`Streaming Extended: Initialized on ${this.platformHandler.platformName}`);
    }

    async loadSettings() {
      return new Promise((resolve) => {
        if (chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.get([
            'autoSkipIntro',
            'autoSkipCredits',
            'autoSkipRecap',
            'autoNextEpisode',
            'skipDelay',
            'nextEpisodeDelay',
            'showNotifications',
            'shortcuts'
          ], (result) => {
            Object.assign(this.settings, result);
            resolve();
          });
        } else {
          console.log('Streaming Extended: Chrome storage not available, using defaults');
          resolve();
        }
      });
    }

    // Platform-aware methods
    findActualSkipButton() {
      const now = Date.now();

      if (now - this.lastButtonSearch < this.buttonCacheTimeout) {
        const cached = this.buttonCache.get('skip');
        if (cached && this.platformHandler.isValidButton(cached)) {
          return cached;
        }
      }

      const button = this.platformHandler.findSkipButton();

      if (button) {
        // Only log if this is a new button or first time finding one
        if (!this.buttonCache.has('skip') || this.buttonCache.get('skip') !== button) {
          console.log(`Streaming Extended: Found skip button on ${this.platformHandler.platformName}`);
        }
        this.buttonCache.set('skip', button);
        this.lastButtonSearch = now;
        return button;
      }

      return this.findGenericSkipButton();
    }

    findGenericSkipButton() {
      const elements = document.querySelectorAll('button, [role="button"], div[role="button"], [onclick]');
      const skipPhrases = [
        'skip intro', 'skip opening', 'skip credits', 'skip recap',
        'skip', 'skip ad', 'skip advertisement', 'skip now'
      ];

      for (const element of elements) {
        try {
          const text = (element.textContent || '').toLowerCase().trim();
          const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
          const classList = (element.getAttribute('class') || '').toLowerCase();

          const isSkipButton = skipPhrases.some(phrase =>
            text.includes(phrase) ||
            ariaLabel.includes(phrase) ||
            classList.includes(phrase.replace(/\s+/g, '-')) ||
            classList.includes(phrase.replace(/\s+/g, ''))
          );

          if (isSkipButton && this.platformHandler.isValidButton(element)) {
            return element;
          }
        } catch (e) {
          console.log('Streaming Extended: Error checking element', e);
        }
      }

      return null;
    }

    findNextEpisodeButton() {
      try {
        if (!this.platformHandler.isWatchPage()) {
          return null;
        }

        const video = this.platformHandler.findVideoElement();
        if (!video) {
          return null;
        }

        // Check cache first for next episode buttons too
        const now = Date.now();
        if (now - this.lastButtonSearch < this.buttonCacheTimeout) {
          const cached = this.buttonCache.get('nextEpisode');
          if (cached && this.platformHandler.isValidButton(cached)) {
            return cached;
          }
        }

        const button = this.platformHandler.findNextEpisodeButton();
        if (button) {
          // Only log if this is a new button or first time finding one
          if (!this.buttonCache.has('nextEpisode') || this.buttonCache.get('nextEpisode') !== button) {
            console.log(`Streaming Extended: Found next episode button on ${this.platformHandler.platformName}`);
          }
          this.buttonCache.set('nextEpisode', button);
          return button;
        }

        return this.findGenericNextEpisodeButton();
      } catch (error) {
        console.error('Streaming Extended: Error in findNextEpisodeButton:', error);
        return null;
      }
    }

    findGenericNextEpisodeButton() {
      const allButtons = document.querySelectorAll('button, [role="button"], [onclick]');
      for (const button of allButtons) {
        const text = (button.textContent || '').toLowerCase().trim();
        const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();

        const isNextButton = (text.includes('next episode') ||
          text.includes('next ep') ||
          text.includes('play next') ||
          ariaLabel.includes('next episode') ||
          ariaLabel.includes('play next')) &&
          this.platformHandler.isValidButton(button);

        if (isNextButton) {
          return button;
        }
      }
      return null;
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (event) => {
        if (!this.isEnabled) return;

        const key = this.getKeyCombo(event);

        if (key === this.settings.shortcuts.toggleExtension) {
          event.preventDefault();
          this.toggleExtension();
        } else if (key === this.settings.shortcuts.forceNextEpisode) {
          event.preventDefault();
          this.forceNextEpisode();
        } else if (key === this.settings.shortcuts.manualSkipIntro) {
          event.preventDefault();
          this.manualSkipIntro();
        }
      });

      console.log('Streaming Extended: Keyboard shortcuts initialized');
    }

    getKeyCombo(event) {
      const parts = [];
      if (event.ctrlKey) parts.push('ctrl');
      if (event.shiftKey) parts.push('shift');
      if (event.altKey) parts.push('alt');
      if (event.metaKey) parts.push('meta');

      const key = event.key.toLowerCase();
      if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
        parts.push(key);
      }

      return parts.join('+');
    }

    toggleExtension() {
      this.isEnabled = !this.isEnabled;
      
      try {
        if (this.isContextValid && this.isContextValid()) {
          chrome.storage.sync.set({ extensionEnabled: this.isEnabled });
        }
      } catch (error) {
        console.log('Streaming Extended: Cannot save settings - context invalidated');
      }

      // Cancel any pending next episode action
      if (this.nextEpisodeTimeout) {
        clearTimeout(this.nextEpisodeTimeout);
        this.nextEpisodeTimeout = null;
        
        // Remove countdown if visible
        const countdown = document.querySelector('.streaming-extended-countdown');
        if (countdown) {
          countdown.remove();
        }
      }

      this.showShortcutNotification(
        this.isEnabled ? 'Extension Enabled' : 'Extension Disabled',
        this.isEnabled ? '✅' : '❌'
      );

      if (this.isEnabled) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }

      console.log(`Streaming Extended: Extension ${this.isEnabled ? 'enabled' : 'disabled'} via shortcut`);
    }

    forceNextEpisode() {
      const nextButton = this.findNextEpisodeButton();
      if (nextButton) {
        this.showShortcutNotification('Forcing Next Episode', '⏭️');
        this.performNextEpisode(nextButton);
      } else {
        this.showShortcutNotification('No Next Episode Button Found', '❌');
      }
    }

    manualSkipIntro() {
      const skipButton = this.findActualSkipButton();
      if (skipButton) {
        this.showShortcutNotification('Manually Skipping', '⏩');
        this.performSkip(skipButton, 'manual');
      } else {
        this.showShortcutNotification('No Skip Button Found', '❌');
      }
    }

    showShortcutNotification(message, icon) {
      const notification = document.createElement('div');
      notification.className = 'streaming-extended-shortcut-notification';
      notification.innerHTML = `
        <div class="shortcut-icon">${icon}</div>
        <div class="shortcut-message">${message}</div>
        <div class="platform-badge">${this.platformHandler.platformName}</div>
      `;

      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        z-index: 999999;
        pointer-events: none;
        box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
        border: 2px solid #00d4ff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: shortcutSlideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
      `;

      if (!document.getElementById('streaming-shortcut-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'streaming-shortcut-styles';
        styleSheet.innerText = `
          @keyframes shortcutSlideIn {
            from { transform: translateX(100%) scale(0.8); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes shortcutSlideOut {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(100%) scale(0.8); opacity: 0; }
          }
          .shortcut-icon { font-size: 20px; min-width: 24px; text-align: center; }
          .shortcut-message { font-size: 14px; font-weight: 500; }
          .platform-badge { 
            font-size: 10px; 
            background: rgba(0, 212, 255, 0.2); 
            padding: 2px 6px; 
            border-radius: 4px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
          }
        `;
        document.head.appendChild(styleSheet);
      }

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'shortcutSlideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 2500);
    }

    // Statistics methods
    async loadStatistics() {
      return new Promise((resolve) => {
        chrome.storage.local.get(['streamingExtendedStats'], (result) => {
          if (result.streamingExtendedStats) {
            this.statistics = { ...this.statistics, ...result.streamingExtendedStats };
          }

          const today = new Date().toDateString();
          if (this.statistics.lastSessionDate !== today) {
            this.statistics.sessionsToday = 1;
            this.statistics.lastSessionDate = today;
          } else {
            this.statistics.sessionsToday++;
          }

          this.saveStatistics();
          resolve();
        });
      });
    }

    saveStatistics() {
      try {
        if (this.isContextValid && this.isContextValid()) {
          chrome.storage.local.set({ streamingExtendedStats: this.statistics });
        }
      } catch (error) {
        console.log('Streaming Extended: Cannot save statistics - context invalidated');
      }
    }

    trackSkip(skipType, estimatedTimeSaved = 30) {
      this.statistics.totalSkips++;
      this.statistics.timeSavedSeconds += estimatedTimeSaved;

      switch (skipType) {
        case 'intro': this.statistics.introSkips++; break;
        case 'credits': this.statistics.creditSkips++; break;
        case 'recap': this.statistics.recapSkips++; break;
        case 'manual': this.statistics.manualSkips++; break;
      }

      this.trackCurrentShow();
      this.trackPeriodStats();
      this.saveStatistics();

      console.log(`Streaming Extended: Tracked ${skipType} skip on ${this.platformHandler.platformName}. Total time saved: ${this.formatTime(this.statistics.timeSavedSeconds)}`);
    }

    trackNextEpisode() {
      this.statistics.nextEpisodeClicks++;
      this.trackCurrentShow();
      this.trackPeriodStats();
      this.saveStatistics();
      console.log(`Streaming Extended: Tracked next episode click on ${this.platformHandler.platformName}. Total: ${this.statistics.nextEpisodeClicks}`);
    }

    trackCurrentShow() {
      try {
        const title = document.title;
        const showName = this.platformHandler.extractShowName(title);

        console.log(`Streaming Extended: Show tracking - Original title: "${title}", Extracted: "${showName}", Platform: ${this.platformHandler.platformName}`);

        if (showName && showName !== 'Unknown Show') {
          if (!this.statistics.mostWatchedShows[showName]) {
            this.statistics.mostWatchedShows[showName] = 0;
          }
          this.statistics.mostWatchedShows[showName]++;
          console.log(`Streaming Extended: Tracked show "${showName}" (count: ${this.statistics.mostWatchedShows[showName]})`);
        }
      } catch (error) {
        console.log('Streaming Extended: Could not track show name:', error);
      }
    }

    trackPeriodStats() {
      const now = new Date();
      const weekKey = this.getWeekKey(now);
      const monthKey = this.getMonthKey(now);

      if (!this.statistics.weeklyStats[weekKey]) {
        this.statistics.weeklyStats[weekKey] = { skips: 0, timeSaved: 0 };
      }
      this.statistics.weeklyStats[weekKey].skips++;
      this.statistics.weeklyStats[weekKey].timeSaved += 30;

      if (!this.statistics.monthlyStats[monthKey]) {
        this.statistics.monthlyStats[monthKey] = { skips: 0, timeSaved: 0 };
      }
      this.statistics.monthlyStats[monthKey].skips++;
      this.statistics.monthlyStats[monthKey].timeSaved += 30;
    }

    getWeekKey(date) {
      const year = date.getFullYear();
      const week = this.getWeekNumber(date);
      return `${year}-W${week}`;
    }

    getMonthKey(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      return `${year}-${month.toString().padStart(2, '0')}`;
    }

    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      } else {
        return `${secs}s`;
      }
    }

    getStatisticsSummary() {
      return {
        totalSkips: this.statistics.totalSkips,
        timeSaved: this.formatTime(this.statistics.timeSavedSeconds),
        timeSavedMinutes: Math.round(this.statistics.timeSavedSeconds / 60),
        introSkips: this.statistics.introSkips,
        creditSkips: this.statistics.creditSkips,
        recapSkips: this.statistics.recapSkips,
        manualSkips: this.statistics.manualSkips,
        nextEpisodeClicks: this.statistics.nextEpisodeClicks,
        sessionsToday: this.statistics.sessionsToday,
        topShows: this.getTopShows(5),
        thisWeekSkips: this.getThisWeekSkips(),
        thisMonthSkips: this.getThisMonthSkips(),
        platform: this.platformHandler.platformName
      };
    }

    getTopShows(limit = 5) {
      return Object.entries(this.statistics.mostWatchedShows)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([show, count]) => ({ show, count }));
    }

    getThisWeekSkips() {
      const weekKey = this.getWeekKey(new Date());
      return this.statistics.weeklyStats[weekKey]?.skips || 0;
    }

    getThisMonthSkips() {
      const monthKey = this.getMonthKey(new Date());
      return this.statistics.monthlyStats[monthKey]?.skips || 0;
    }

    // Core functionality methods
    startMonitoring() {
      this.stopMonitoring();
      console.log(`Streaming Extended: Starting monitoring on ${this.platformHandler.platformName}...`);

      this.observer = this.createObserver();
      this.checkInterval = setInterval(() => {
        this.checkForButtons();
      }, 2000); // Reduced frequency from 1000ms to 2000ms

      this.monitorVideoEvents();
      this.checkForButtons();
      return true;
    }

    stopMonitoring() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }

      if (this.checkTimeout) {
        clearTimeout(this.checkTimeout);
        this.checkTimeout = null;
      }

      if (this.video) {
        this.video.removeEventListener('timeupdate', this.boundOnTimeUpdate);
        this.video.removeEventListener('ended', this.boundOnVideoEnded);
        this.video = null;
      }

      console.log(`Streaming Extended: Monitoring stopped on ${this.platformHandler.platformName}`);
      return true;
    }

    createObserver() {
      const observer = new MutationObserver((mutations) => {
        if (!this.isEnabled) return;

        let shouldCheck = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && this.couldContainButtons(node)) {
                shouldCheck = true;
              }
            });
          }
        });

        if (shouldCheck) {
          // Only check for skip buttons immediately, not next episode buttons
          // Next episode buttons should only be handled when video is near end
          clearTimeout(this.checkTimeout);
          this.checkTimeout = setTimeout(() => {
            if (this.isEnabled) {
              this.checkForButtons();
            }
          }, 200);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      this.observers.push(observer);
      return observer;
    }

    couldContainButtons(node) {
      if (!node.tagName) return false;
      const tagName = node.tagName.toLowerCase();
      const textContent = (node.textContent || '').toLowerCase();
      return tagName === 'button' ||
        tagName === 'div' ||
        textContent.includes('skip') ||
        textContent.includes('next') ||
        textContent.includes('continue');
    }

    async monitorVideoEvents() {
      try {
        if (this.videoCheckInterval) {
          clearInterval(this.videoCheckInterval);
          this.videoCheckInterval = null;
        }

        const checkVideoEvents = () => {
          try {
            if (!this.platformHandler.isWatchPage()) {
              return;
            }

            const videos = document.querySelectorAll('video');

            if (videos.length > 0 && !this.videoElements.size) {
              console.log(`Streaming Extended: Found ${videos.length} video elements on ${this.platformHandler.platformName}`);
            }

            videos.forEach((video, index) => {
              if (!this.videoElements.has(video)) {
                console.log(`Streaming Extended: Monitoring video element #${index} on ${this.platformHandler.platformName}`);

                const onEnded = () => this.handleVideoEnded(video);
                const onTimeUpdate = () => this.handleVideoTimeUpdate(video);

                video.addEventListener('ended', onEnded);
                video.addEventListener('timeupdate', onTimeUpdate);

                this.videoElements.set(video, {
                  onEnded,
                  onTimeUpdate,
                  lastTimeUpdate: 0
                });
              }
            });
          } catch (error) {
            console.error('Streaming Extended: Error in video event check:', error);
          }
        };

        checkVideoEvents();
        this.videoCheckInterval = setInterval(checkVideoEvents, 5000); // Reduced frequency from 3000ms to 5000ms
      } catch (error) {
        console.error('Streaming Extended: Error in monitorVideoEvents:', error);
        setTimeout(() => this.monitorVideoEvents(), 5000);
      }
    }

    handleVideoEnded(video) {
      console.log(`Streaming Extended: Video ended on ${this.platformHandler.platformName}`);
      this.queueAction(() => this.checkForNextEpisodeButton());
      this.queueAction(() => this.checkForNextEpisodeButton(), 1000);
      this.queueAction(() => this.checkForNextEpisodeButton(), 3000);
    }

    handleVideoTimeUpdate(video) {
      try {
        if (!video.duration || !video.currentTime) return;

        const videoData = this.videoElements.get(video);
        const now = Date.now();

        if (now - videoData.lastTimeUpdate < 1000) return;
        videoData.lastTimeUpdate = now;

        const timeLeft = video.duration - video.currentTime;

        if ((timeLeft <= 15 && timeLeft > 14) || (timeLeft <= 10 && timeLeft > 9)) {
          this.queueAction(() => this.checkForNextEpisodeButton());
        }
      } catch (error) {
        console.error('Streaming Extended: Error in handleVideoTimeUpdate:', error);
      }
    }

    queueAction(action, delay = 0) {
      const execute = () => {
        if (!this.isEnabled) return;

        const wrappedAction = async () => {
          try {
            await action();
          } catch (error) {
            console.error('Streaming Extended: Error in queued action:', error);
          }
        };

        this.actionQueue.push(wrappedAction);
        this.processActionQueue();
      };

      if (delay > 0) {
        setTimeout(execute, delay);
      } else {
        execute();
      }
    }

    async processActionQueue() {
      if (this.isProcessingQueue || this.actionQueue.length === 0) return;

      this.isProcessingQueue = true;

      try {
        while (this.actionQueue.length > 0) {
          const action = this.actionQueue.shift();
          await action();
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Streaming Extended: Error processing action queue:', error);
      } finally {
        this.isProcessingQueue = false;
      }
    }

    checkForButtons() {
      try {
        // Throttle button checking to prevent excessive searches
        const now = Date.now();
        if (now - this.lastButtonCheck < this.buttonCheckThrottle) {
          return;
        }
        this.lastButtonCheck = now;

        const skipButton = this.findActualSkipButton();
        if (skipButton && !this.processedButtons.has(skipButton)) {
          this.handleSkipButton(skipButton);
          this.processedButtons.add(skipButton);
        }

        // Check for next episode buttons with timing logic
        const nextButton = this.findNextEpisodeButton();
        if (nextButton && !this.processedNextButtons.has(nextButton)) {
          console.log(`Streaming Extended: Found next episode button, checking timing...`);
          if (this.isVideoNearEndOrEnded()) {
            console.log(`Streaming Extended: Video timing OK, handling next episode button`);
            this.handleNextEpisodeButton(nextButton);
            this.processedNextButtons.add(nextButton);
          } else {
            console.log(`Streaming Extended: Video not near end, button found but not handled`);
          }
        }
      } catch (error) {
        console.error('Streaming Extended: Error in checkForButtons:', error);
      }
    }

    checkForNextEpisodeButton() {
      try {
        const nextButton = this.findNextEpisodeButton();
        if (nextButton && !this.processedNextButtons.has(nextButton)) {
          console.log(`Streaming Extended: checkForNextEpisodeButton found button, checking timing...`);
          if (this.isVideoNearEndOrEnded()) {
            console.log(`Streaming Extended: Video timing OK in checkForNextEpisodeButton`);
            this.handleNextEpisodeButton(nextButton);
            this.processedNextButtons.add(nextButton);
          } else {
            console.log(`Streaming Extended: Video not near end in checkForNextEpisodeButton`);
          }
        } else if (!nextButton) {
          console.log(`Streaming Extended: No next episode button found in checkForNextEpisodeButton`);
        }
      } catch (error) {
        console.error('Streaming Extended: Error in checkForNextEpisodeButton:', error);
      }
    }

    handleSkipButton(button) {
      const buttonText = (button.textContent || '').toLowerCase();
      const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
      const buttonInfo = `${buttonText} ${ariaLabel}`.toLowerCase();

      let skipType = 'intro';
      let shouldSkip = false;

      if (buttonInfo.includes('intro') || buttonInfo.includes('opening')) {
        skipType = 'intro';
        shouldSkip = this.settings.autoSkipIntro;
      } else if (buttonInfo.includes('credit') || buttonInfo.includes('end')) {
        skipType = 'credits';
        shouldSkip = this.settings.autoSkipCredits;
      } else if (buttonInfo.includes('recap') || buttonInfo.includes('previously')) {
        skipType = 'recap';
        shouldSkip = this.settings.autoSkipRecap;
      } else if (buttonInfo.includes('skip')) {
        skipType = 'intro';
        shouldSkip = this.settings.autoSkipIntro;
      }

      if (shouldSkip) {
        this.scheduleSkip(button, skipType);
      }
    }

    handleNextEpisodeButton(button) {
      if (!this.settings.autoNextEpisode) {
        console.log('Streaming Extended: Auto-next episode is disabled in settings');
        return;
      }

      // Check if URL has changed (new episode loaded)
      if (window.location.href !== this.currentUrl) {
        this.currentUrl = window.location.href;
        this.lastNextEpisodeTime = 0; // Reset cooldown for new episode
        // Clear processed buttons for new episode
        this.processedNextButtons = new WeakSet();
      }

      const now = Date.now();
      if (now - this.lastNextEpisodeTime < 15000) { // Increased cooldown to 15 seconds
        console.log('Streaming Extended: Next episode cooldown active');
        return;
      }

      // Check if video is near end or has ended, with fallback for timing issues
      const videoNearEnd = this.isVideoNearEndOrEnded();
      if (!videoNearEnd) {
        this.videoTimingFailures++;
        console.log(`Streaming Extended: Video not near end, ignoring next episode button (failures: ${this.videoTimingFailures})`);
        
        // Fallback: If video timing has failed many times, allow next episode after longer delay
        if (this.videoTimingFailures < 5) {
          return;
        } else {
          console.log('Streaming Extended: Video timing consistently failing, using fallback logic');
          // Continue with extended delay for safety
        }
      } else {
        // Reset failure counter on successful timing check
        this.videoTimingFailures = 0;
      }

      const delay = this.settings.nextEpisodeDelay;
      console.log(`Streaming Extended: Scheduling next episode in ${delay}ms on ${this.platformHandler.platformName}`);

      // Use longer delay if we're using fallback logic (video timing failed)
      const baseMinimum = videoNearEnd ? 3000 : 10000; // 10 seconds minimum for fallback
      const effectiveDelay = Math.max(baseMinimum, delay);
      
      // Show countdown warning if delay is more than 2 seconds
      if (effectiveDelay > 2000) {
        this.showNextEpisodeCountdown(effectiveDelay);
      }

      const executeNextEpisode = () => {
        let buttonToClick = this.isButtonStillValid(button) ? button : this.findNextEpisodeButton();

        if (buttonToClick) {
          console.log(`Streaming Extended: Clicking next episode button on ${this.platformHandler.platformName}`);
          this.performNextEpisode(buttonToClick);
          this.lastNextEpisodeTime = Date.now();
          this.processedNextButtons.add(buttonToClick);

          setTimeout(() => {
            this.processedNextButtons.delete(buttonToClick);
          }, 10000);
        } else {
          console.log('Streaming Extended: No valid next episode button found to click');
          // Don't retry to prevent infinite loops
          // User can manually trigger next episode if needed
        }
      };

      // Clear any existing timeout
      if (this.nextEpisodeTimeout) {
        clearTimeout(this.nextEpisodeTimeout);
      }

      if (effectiveDelay <= 0) {
        executeNextEpisode();
      } else {
        this.nextEpisodeTimeout = setTimeout(executeNextEpisode, effectiveDelay);
      }
    }

    scheduleSkip(button, skipType) {
      const now = Date.now();
      if (now - this.lastSkipTime < 5000) {
        console.log('Streaming Extended: Skip cooldown active');
        return;
      }

      console.log(`Streaming Extended: Scheduling ${skipType} skip in ${this.settings.skipDelay}ms on ${this.platformHandler.platformName}`);

      setTimeout(() => {
        if (this.isButtonStillValid(button)) {
          this.performSkip(button, skipType);
        } else {
          console.log('Streaming Extended: Button no longer valid, searching for new button');
          const newButton = this.findActualSkipButton();
          if (newButton && !this.processedButtons.has(newButton)) {
            this.performSkip(newButton, skipType);
            this.processedButtons.add(newButton);
          }
        }
      }, this.settings.skipDelay);
    }

    isButtonStillValid(button) {
      try {
        if (!document.contains(button)) {
          return false;
        }
        return this.platformHandler.isValidButton(button);
      } catch (error) {
        return false;
      }
    }

    performSkip(button, skipType) {
      try {
        this.lastSkipTime = Date.now();

        console.log(`Streaming Extended: Attempting to skip ${skipType} on ${this.platformHandler.platformName}`);

        const clicked = this.clickHiddenButton(button);

        if (clicked) {
          this.trackSkip(skipType);

          if (this.settings.showNotifications) {
            this.addSkipIndicator(button, `${skipType} skipped`);
          }
          console.log(`Streaming Extended: Successfully clicked ${skipType} button on ${this.platformHandler.platformName}`);
          return true;
        } else {
          console.error(`Streaming Extended: Failed to click ${skipType} button on ${this.platformHandler.platformName}`);
          return false;
        }
      } catch (error) {
        console.error('Streaming Extended: Error in performSkip:', error);
        return false;
      }
    }

    performNextEpisode(button) {
      this.lastNextEpisodeTime = Date.now();
      console.log(`Streaming Extended: Attempting to go to next episode on ${this.platformHandler.platformName}`);
      const clicked = this.clickButton(button);
      if (clicked) {
        this.trackNextEpisode();
        console.log(`Streaming Extended: Successfully clicked next episode button on ${this.platformHandler.platformName}`);
      } else {
        console.error(`Streaming Extended: Error going to next episode on ${this.platformHandler.platformName}: click failed`);
      }
    }

    clickButton(button) {
      if (!button) {
        console.error('Streaming Extended: No button provided to click');
        return false;
      }

      console.log(`Streaming Extended: Attempting to click button on ${this.platformHandler.platformName}:`, {
        tagName: button.tagName,
        className: button.className,
        id: button.id,
        text: button.textContent ? button.textContent.trim() : ''
      });

      const tryClickMethod = (methodName, fn) => {
        try {
          console.log(`Streaming Extended: Trying ${methodName}...`);
          fn();
          console.log(`Streaming Extended: ${methodName} succeeded`);
          return true;
        } catch (error) {
          console.log(`Streaming Extended: ${methodName} failed:`, error.message);
          return false;
        }
      };

      if (tryClickMethod('direct click', () => button.click())) {
        return true;
      }

      const rect = button.getBoundingClientRect();
      const clientX = rect.left + (rect.width / 2);
      const clientY = rect.top + (rect.height / 2);

      if (tryClickMethod('mouse event', () => {
        const commonEventProps = {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX,
          clientY
        };
        button.dispatchEvent(new MouseEvent('mousedown', commonEventProps));
        button.dispatchEvent(new MouseEvent('mouseup', commonEventProps));
        button.dispatchEvent(new MouseEvent('click', commonEventProps));
      })) {
        return true;
      }

      if (tryClickMethod('focus and enter', () => {
        button.focus();
        const commonKeyboardProps = {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        };
        button.dispatchEvent(new KeyboardEvent('keydown', commonKeyboardProps));
        button.dispatchEvent(new KeyboardEvent('keypress', commonKeyboardProps));
        button.dispatchEvent(new KeyboardEvent('keyup', commonKeyboardProps));
      })) {
        return true;
      }

      if (button.parentElement && button.parentElement.tagName !== 'BODY') {
        console.log('Streaming Extended: Trying to click parent element');
        return this.clickButton(button.parentElement);
      }

      console.error('Streaming Extended: All click methods failed');
      return false;
    }

    addSkipIndicator(button, message = 'Auto-Skipped') {
      const indicator = document.createElement('div');
      indicator.className = 'streaming-extended-skip-indicator';
      indicator.innerHTML = `
        <span class="skip-icon">⚡</span>
        <span class="skip-message">${message}</span>
        <span class="platform-badge">${this.platformHandler.platformName}</span>
      `;

      const rect = button.getBoundingClientRect();
      indicator.style.cssText = `
        position: fixed;
        top: ${Math.max(10, rect.top - 40)}px;
        left: ${rect.left}px;
        background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 999999;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
        animation: streamingExtendedFadeOut 3s forwards;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      if (!document.getElementById('streaming-extended-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'streaming-extended-styles';
        styleSheet.innerText = `
            @keyframes streamingExtendedFadeOut {
                0% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
            .skip-icon { font-size: 16px; }
            .skip-message { font-size: 12px; }
            .platform-badge { 
              font-size: 10px; 
              background: rgba(255, 255, 255, 0.2); 
              padding: 2px 4px; 
              border-radius: 3px; 
              text-transform: uppercase; 
            }
        `;
        document.head.appendChild(styleSheet);
      }

      document.body.appendChild(indicator);

      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 3000);
    }

    isElementHidden(element) {
      const style = window.getComputedStyle(element);
      return style.display === 'none' ||
        style.visibility === 'hidden' ||
        parseFloat(style.opacity) === 0;
    }

    clickHiddenButton(button) {
      if (!button) return false;

      try {
        const originalStyle = {
          display: button.style.display,
          visibility: button.style.visibility,
          opacity: button.style.opacity
        };

        button.style.display = 'block';
        button.style.visibility = 'visible';
        button.style.opacity = '1';

        const success = this.clickButton(button);

        button.style.display = originalStyle.display;
        button.style.visibility = originalStyle.visibility;
        button.style.opacity = originalStyle.opacity;

        return success;
      } catch (error) {
        console.error('Streaming Extended: Error clicking hidden button:', error);
        return this.clickButton(button);
      }
    }
  }

  // Global error handler for context invalidation
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('Extension context invalidated')) {
      console.log('Streaming Extended: Caught extension context invalidation error');
      event.preventDefault();
      return true;
    }
  });

  // Initialize the extension
  try {
    new StreamingExtended();
    
    // Initialize IMDB Ratings after a short delay to ensure DOM is ready
    setTimeout(() => {
      try {
        // Load IMDB ratings script
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('imdb-ratings.js');
        script.onload = () => {
          // Initialize IMDB ratings
          window.imdbRatings = new window.IMDBRatings();
          console.log('Streaming Extended: IMDB Ratings initialized');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Streaming Extended: Failed to initialize IMDB ratings:', error);
      }
    }, 2000);
    
  } catch (error) {
    console.error('Streaming Extended: Failed to initialize:', error);
  }
})();