// Background script for Streaming Extended

// Default settings
const DEFAULT_SETTINGS = {
  extensionEnabled: true,
  autoSkipIntro: true,
  autoSkipCredits: true,
  autoSkipRecap: true,
  autoNextEpisode: true,
  skipDelay: 1000,
  nextEpisodeDelay: 5000,
  showNotifications: false,
  shortcuts: {
    toggleExtension: 'ctrl+shift+s',
    forceNextEpisode: 'ctrl+shift+n',
    manualSkipIntro: 'ctrl+shift+i'
  }
};

// Initialize extension
function initializeExtension() {
  // Set default settings if not already set
  chrome.storage.sync.get(null, (items) => {
    const settingsToSet = {};
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      if (items[key] === undefined) {
        settingsToSet[key] = value;
      }
    }
    
    if (Object.keys(settingsToSet).length > 0) {
      chrome.storage.sync.set(settingsToSet);
    }
    
    console.log('Streaming Extended: Initialized with settings', settingsToSet);
  });
  
  // Notify content scripts that the extension has been reloaded
  notifyContentScripts('EXTENSION_RELOADED');
}

// Notify all tabs with the content script
function notifyContentScripts(message) {
  const supportedPlatforms = ['hotstar.com', 'netflix.com', 'primevideo.com', 'disneyplus.com', 'hulu.com', 'max.com'];
  
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const isSupported = supportedPlatforms.some(platform => tab.url && tab.url.includes(platform));
      if (isSupported) {
        try {
          chrome.tabs.sendMessage(tab.id, message, (response) => {
            if (chrome.runtime.lastError) {
              // Ignore connection errors - content script may not be ready
              console.log('Streaming Extended: Content script not ready on tab', tab.id);
            }
          });
        } catch (error) {
          console.error('Streaming Extended: Error sending message to tab', tab.id, error);
        }
      }
    });
  });
}

// Handle extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Streaming Extended: Extension installed/updated', details.reason);
  initializeExtension();
  
  // If this is an update, notify content scripts
  if (details.reason === 'update') {
    notifyContentScripts('EXTENSION_UPDATED');
  }
});

// Handle browser action click
chrome.action.onClicked.addListener((tab) => {
  try {
    chrome.tabs.create({ url: 'popup.html' });
  } catch (error) {
    console.error('Hotstar Extended: Error opening popup:', error);
  }
});

// Listen for tab updates to notify content scripts if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const supportedPlatforms = ['hotstar.com', 'netflix.com', 'primevideo.com', 'disneyplus.com', 'hulu.com', 'max.com'];
  const isSupported = supportedPlatforms.some(platform => tab.url && tab.url.includes(platform));
  
  if (changeInfo.status === 'complete' && isSupported) {
    // The content script is already declared in manifest.json
    console.log('Streaming Extended: Tab updated, notifying content script');
    try {
      chrome.tabs.sendMessage(tabId, 'PAGE_LOADED', (response) => {
        if (chrome.runtime.lastError) {
          // Ignore connection errors - content script may not be ready yet
          console.log('Streaming Extended: Content script not ready on tab', tabId);
        }
      });
    } catch (error) {
      console.error('Streaming Extended: Error sending PAGE_LOADED to tab', tabId, error);
    }
  }
});

// Handle extension context invalidation
chrome.runtime.onSuspend.addListener(() => {
  console.log('Streaming Extended: Extension is about to be suspended');
});

// Initialize the extension
initializeExtension();