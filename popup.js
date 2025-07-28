// Popup script for Hotstar Extended
class PopupManager {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.checkTabStatus();
    this.loadStatistics();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'extensionEnabled',
        'autoSkipIntro',
        'autoSkipCredits',
        'autoSkipRecap',
        'autoNextEpisode',
        'skipDelay',
        'nextEpisodeDelay',
        'showNotifications',
        'showIMDBRatings'
      ], (result) => {
        // Set defaults if not found
        this.settings = {
          extensionEnabled: result.extensionEnabled !== undefined ? result.extensionEnabled : true,
          autoSkipIntro: result.autoSkipIntro !== undefined ? result.autoSkipIntro : true,
          autoSkipCredits: result.autoSkipCredits !== undefined ? result.autoSkipCredits : true,
          autoSkipRecap: result.autoSkipRecap !== undefined ? result.autoSkipRecap : true,
          autoNextEpisode: result.autoNextEpisode !== undefined ? result.autoNextEpisode : true,
          skipDelay: result.skipDelay || 1000,
          nextEpisodeDelay: result.nextEpisodeDelay !== undefined ? result.nextEpisodeDelay : 0,
          showNotifications: result.showNotifications !== undefined ? result.showNotifications : true,
          showIMDBRatings: result.showIMDBRatings !== undefined ? result.showIMDBRatings : true
        };
        resolve();
      });
    });
  }

  setupEventListeners() {
    // Master toggle switch
    const masterToggle = document.getElementById('extensionEnabled');
    masterToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      this.updateSetting('extensionEnabled', enabled);
      
      // Send message to content script to update state
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'setExtensionEnabled', 
            enabled: enabled 
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.log('Streaming Extended: Content script not available');
            }
          });
        }
      });
      
      // Save to storage
      chrome.storage.sync.set({ extensionEnabled: enabled });
    });
    
    // Other toggle switches
    const toggles = document.querySelectorAll('input[type="checkbox"]:not(#extensionEnabled)');
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const setting = e.target.id;
        const value = e.target.checked;
        this.updateSetting(setting, value);
      });
    });

    // Skip delay select
    const skipDelaySelect = document.getElementById('skipDelay');
    skipDelaySelect.addEventListener('change', (e) => {
      const value = parseInt(e.target.value);
      this.updateSetting('skipDelay', value);
    });

    // Next episode delay select
    const nextEpisodeDelaySelect = document.getElementById('nextEpisodeDelay');
    nextEpisodeDelaySelect.addEventListener('change', (e) => {
      const value = parseInt(e.target.value);
      this.updateSetting('nextEpisodeDelay', value);
    });

    // Open options button
    const openOptionsBtn = document.getElementById('openOptions');
    openOptionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    
    // Save to storage
    chrome.storage.sync.set({ [key]: value });
    
    // Update UI
    this.updateUI();
  }

  updateUI() {
    // Update master toggle
    const extensionEnabled = document.getElementById('extensionEnabled');
    extensionEnabled.checked = this.settings.extensionEnabled;
    
    // Update toggle states
    const toggles = [
      'autoSkipIntro',
      'autoSkipCredits',
      'autoSkipRecap',
      'autoNextEpisode',
      'showNotifications',
      'showIMDBRatings'
    ];
    
    toggles.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.checked = this.settings[id];
        element.disabled = !this.settings.extensionEnabled;
      }
    });
    
    // Update delay selects
    const delaySelects = ['skipDelay', 'nextEpisodeDelay'];
    delaySelects.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.value = this.settings[id].toString();
        element.disabled = !this.settings.extensionEnabled;
      }
    });
    
    // Toggle section opacity based on enabled state
    const sections = document.querySelectorAll('.section:not(.master-toggle)');
    sections.forEach(section => {
      section.style.opacity = this.settings.extensionEnabled ? '1' : '0.6';
    });
  }

  async checkTabStatus() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const statusElement = document.getElementById('status');
      const statusDot = statusElement.querySelector('.status-dot');
      const statusText = statusElement.querySelector('.status-text');
      
      const supportedPlatforms = ['hotstar.com', 'netflix.com', 'primevideo.com', 'disneyplus.com', 'hulu.com', 'max.com'];
      const activePlatform = supportedPlatforms.find(platform => tab && tab.url && tab.url.includes(platform));
      
      if (activePlatform) {
        statusDot.style.background = '#00ff88';
        const platformName = activePlatform.split('.')[0];
        const displayName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
        statusText.textContent = `Active on ${displayName}`;
      } else {
        statusDot.style.background = '#ff6b6b';
        statusText.textContent = 'Not on supported platform';
      }
    } catch (error) {
      console.error('Error checking tab status:', error);
    }
  }

  async loadStatistics() {
    try {
      // Get statistics from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const supportedPlatforms = ['hotstar.com', 'netflix.com', 'primevideo.com', 'disneyplus.com', 'hulu.com', 'max.com'];
      const isOnSupportedPlatform = supportedPlatforms.some(platform => tab && tab.url && tab.url.includes(platform));
      
      if (isOnSupportedPlatform) {
        // Try to get stats from content script
        chrome.tabs.sendMessage(tab.id, { action: 'getStatistics' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Streaming Extended: Content script not ready, loading from storage');
            this.loadStatisticsFromStorage();
            return;
          }
          
          if (response && response.statistics) {
            this.displayStatistics(response.statistics);
          } else {
            // Fallback to storage
            this.loadStatisticsFromStorage();
          }
        });
      } else {
        // Load from storage when not on supported platform
        this.loadStatisticsFromStorage();
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      this.loadStatisticsFromStorage();
    }
  }

  loadStatisticsFromStorage() {
    chrome.storage.local.get(['streamingExtendedStats'], (result) => {
      if (result.streamingExtendedStats) {
        const stats = this.processStatistics(result.streamingExtendedStats);
        this.displayStatistics(stats);
      } else {
        // Display empty stats if no data
        this.displayStatistics({
          totalSkips: 0,
          timeSaved: '0s',
          thisWeekSkips: 0,
          nextEpisodeClicks: 0,
          topShows: []
        });
      }
    });
  }

  processStatistics(rawStats) {
    return {
      totalSkips: rawStats.totalSkips || 0,
      timeSaved: this.formatTime(rawStats.timeSavedSeconds || 0),
      timeSavedMinutes: Math.round((rawStats.timeSavedSeconds || 0) / 60),
      thisWeekSkips: this.getThisWeekSkips(rawStats.weeklyStats || {}),
      nextEpisodeClicks: rawStats.nextEpisodeClicks || 0,
      topShows: this.getTopShows(rawStats.mostWatchedShows || {}, 3)
    };
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }

  getThisWeekSkips(weeklyStats) {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getWeekNumber(now);
    const weekKey = `${year}-W${week}`;
    
    return weeklyStats[weekKey]?.skips || 0;
  }

  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  getTopShows(mostWatchedShows, limit = 3) {
    return Object.entries(mostWatchedShows)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([show, count]) => ({ show, count }));
  }

  displayStatistics(stats) {
    // Update stat values
    document.getElementById('totalSkips').textContent = stats.totalSkips;
    document.getElementById('timeSaved').textContent = stats.timeSaved;
    document.getElementById('thisWeekSkips').textContent = stats.thisWeekSkips;
    document.getElementById('nextEpisodeClicks').textContent = stats.nextEpisodeClicks;

    // Update top shows
    const showsList = document.getElementById('showsList');
    if (stats.topShows && stats.topShows.length > 0) {
      showsList.innerHTML = stats.topShows.map(({ show, count }) => `
        <div class="show-item">
          <div class="show-name" title="${show}">${show}</div>
          <div class="show-count">${count}</div>
        </div>
      `).join('');
    } else {
      showsList.innerHTML = '<div class="no-data">No data yet</div>';
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});