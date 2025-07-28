// Options page script for Hotstar Extended
class OptionsManager {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'autoSkipIntro',
        'autoSkipCredits',
        'autoSkipRecap',
        'autoNextEpisode',
        'skipDelay',
        'nextEpisodeDelay',
        'showNotifications',
        'showIMDBRatings',
        'ratingsPosition',
        'ratingsAutoHide',
        'shortcuts'
      ], (result) => {
        // Set defaults if not found
        this.settings = {
          autoSkipIntro: result.autoSkipIntro !== undefined ? result.autoSkipIntro : true,
          autoSkipCredits: result.autoSkipCredits !== undefined ? result.autoSkipCredits : true,
          autoSkipRecap: result.autoSkipRecap !== undefined ? result.autoSkipRecap : true,
          autoNextEpisode: result.autoNextEpisode !== undefined ? result.autoNextEpisode : true,
          skipDelay: result.skipDelay || 1000,
          nextEpisodeDelay: result.nextEpisodeDelay !== undefined ? result.nextEpisodeDelay : 0,
          showNotifications: result.showNotifications !== undefined ? result.showNotifications : true,
          showIMDBRatings: result.showIMDBRatings !== undefined ? result.showIMDBRatings : true,
          ratingsPosition: result.ratingsPosition || 'top-right',
          ratingsAutoHide: result.ratingsAutoHide !== undefined ? result.ratingsAutoHide : 10000,
          shortcuts: result.shortcuts || {
            toggleExtension: 'ctrl+shift+s',
            forceNextEpisode: 'ctrl+shift+n',
            manualSkipIntro: 'ctrl+shift+i'
          }
        };
        resolve();
      });
    });
  }

  setupEventListeners() {
    // Toggle switches
    const toggles = document.querySelectorAll('input[type="checkbox"]');
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

    // Shortcut inputs
    const shortcutInputs = ['shortcutToggle', 'shortcutNext', 'shortcutSkip'];
    shortcutInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      input.addEventListener('keydown', (e) => this.handleShortcutInput(e, inputId));
      input.addEventListener('blur', (e) => this.saveShortcut(inputId, e.target.value));
    });

    // Reset settings button
    const resetBtn = document.getElementById('resetSettings');
    resetBtn.addEventListener('click', () => {
      this.resetSettings();
    });
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    
    // Save to storage
    chrome.storage.sync.set({ [key]: value });
    
    // Show feedback
    this.showFeedback(`${key} updated`);
  }

  updateUI() {
    // Update toggle states
    document.getElementById('autoSkipIntro').checked = this.settings.autoSkipIntro;
    document.getElementById('autoSkipCredits').checked = this.settings.autoSkipCredits;
    document.getElementById('autoSkipRecap').checked = this.settings.autoSkipRecap;
    document.getElementById('autoNextEpisode').checked = this.settings.autoNextEpisode;
    document.getElementById('showNotifications').checked = this.settings.showNotifications;
    
    // Update delay selects
    document.getElementById('skipDelay').value = this.settings.skipDelay.toString();
    document.getElementById('nextEpisodeDelay').value = this.settings.nextEpisodeDelay.toString();
    
    // Update shortcut inputs
    document.getElementById('shortcutToggle').value = this.settings.shortcuts.toggleExtension;
    document.getElementById('shortcutNext').value = this.settings.shortcuts.forceNextEpisode;
    document.getElementById('shortcutSkip').value = this.settings.shortcuts.manualSkipIntro;
  }

  handleShortcutInput(event, inputId) {
    event.preventDefault();
    
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    if (event.metaKey) parts.push('meta');
    
    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      parts.push(key);
    }
    
    const combo = parts.join('+');
    if (parts.length > 1) { // Must have at least one modifier
      event.target.value = combo;
      this.saveShortcut(inputId, combo);
    }
  }

  saveShortcut(inputId, combo) {
    const shortcutMap = {
      'shortcutToggle': 'toggleExtension',
      'shortcutNext': 'forceNextEpisode',
      'shortcutSkip': 'manualSkipIntro'
    };
    
    const shortcutKey = shortcutMap[inputId];
    if (shortcutKey) {
      this.settings.shortcuts[shortcutKey] = combo;
      chrome.storage.sync.set({ shortcuts: this.settings.shortcuts });
      this.showFeedback(`Shortcut updated: ${combo}`);
    }
  }

  resetSettings() {
    const defaultSettings = {
      autoSkipIntro: true,
      autoSkipCredits: true,
      autoSkipRecap: true,
      autoNextEpisode: true,
      skipDelay: 1000,
      nextEpisodeDelay: 0,
      showNotifications: true,
      shortcuts: {
        toggleExtension: 'ctrl+shift+s',
        forceNextEpisode: 'ctrl+shift+n',
        manualSkipIntro: 'ctrl+shift+i'
      }
    };

    this.settings = defaultSettings;
    chrome.storage.sync.set(defaultSettings);
    this.updateUI();
    this.showFeedback('Settings reset to defaults');
  }

  showFeedback(message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #00d4ff;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(feedback);

    // Remove after 3 seconds
    setTimeout(() => {
      feedback.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .shortcut-input {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    font-family: 'Courier New', monospace;
    color: #495057;
    min-width: 150px;
    text-align: center;
  }
  
  .shortcut-input:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
  
  .shortcut-input::placeholder {
    color: #6c757d;
    font-style: italic;
  }
`;
document.head.appendChild(style);

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});