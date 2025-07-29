import"./modulepreload-polyfill.js";class u{constructor(){this.settings={},this.init()}async init(){await this.loadSettings(),this.setupEventListeners(),this.updateUI()}async loadSettings(){return new Promise(e=>{chrome.storage.sync.get(["autoSkipIntro","autoSkipCredits","autoSkipRecap","autoNextEpisode","skipDelay","nextEpisodeDelay","showNotifications","showIMDBRatings","ratingsPosition","ratingsAutoHide","shortcuts"],t=>{this.settings={autoSkipIntro:t.autoSkipIntro!==void 0?t.autoSkipIntro:!0,autoSkipCredits:t.autoSkipCredits!==void 0?t.autoSkipCredits:!0,autoSkipRecap:t.autoSkipRecap!==void 0?t.autoSkipRecap:!0,autoNextEpisode:t.autoNextEpisode!==void 0?t.autoNextEpisode:!0,skipDelay:t.skipDelay||1e3,nextEpisodeDelay:t.nextEpisodeDelay!==void 0?t.nextEpisodeDelay:0,showNotifications:t.showNotifications!==void 0?t.showNotifications:!0,showIMDBRatings:t.showIMDBRatings!==void 0?t.showIMDBRatings:!0,ratingsPosition:t.ratingsPosition||"top-right",ratingsAutoHide:t.ratingsAutoHide!==void 0?t.ratingsAutoHide:1e4,shortcuts:t.shortcuts||{toggleExtension:"ctrl+shift+s",forceNextEpisode:"ctrl+shift+n",manualSkipIntro:"ctrl+shift+i"}},e()})})}setupEventListeners(){document.querySelectorAll('input[type="checkbox"]').forEach(i=>{i.addEventListener("change",n=>{const a=n.target.id,r=n.target.checked;this.updateSetting(a,r)})}),document.getElementById("skipDelay").addEventListener("change",i=>{const n=parseInt(i.target.value);this.updateSetting("skipDelay",n)}),document.getElementById("nextEpisodeDelay").addEventListener("change",i=>{const n=parseInt(i.target.value);this.updateSetting("nextEpisodeDelay",n)}),["shortcutToggle","shortcutNext","shortcutSkip"].forEach(i=>{const n=document.getElementById(i);n.addEventListener("keydown",a=>this.handleShortcutInput(a,i)),n.addEventListener("blur",a=>this.saveShortcut(i,a.target.value))}),document.getElementById("resetSettings").addEventListener("click",()=>{this.resetSettings()})}updateSetting(e,t){this.settings[e]=t,chrome.storage.sync.set({[e]:t}),this.showFeedback(`${e} updated`)}updateUI(){document.getElementById("autoSkipIntro").checked=this.settings.autoSkipIntro,document.getElementById("autoSkipCredits").checked=this.settings.autoSkipCredits,document.getElementById("autoSkipRecap").checked=this.settings.autoSkipRecap,document.getElementById("autoNextEpisode").checked=this.settings.autoNextEpisode,document.getElementById("showNotifications").checked=this.settings.showNotifications,document.getElementById("skipDelay").value=this.settings.skipDelay.toString(),document.getElementById("nextEpisodeDelay").value=this.settings.nextEpisodeDelay.toString(),document.getElementById("shortcutToggle").value=this.settings.shortcuts.toggleExtension,document.getElementById("shortcutNext").value=this.settings.shortcuts.forceNextEpisode,document.getElementById("shortcutSkip").value=this.settings.shortcuts.manualSkipIntro}handleShortcutInput(e,t){e.preventDefault();const s=[];e.ctrlKey&&s.push("ctrl"),e.shiftKey&&s.push("shift"),e.altKey&&s.push("alt"),e.metaKey&&s.push("meta");const o=e.key.toLowerCase();o!=="control"&&o!=="shift"&&o!=="alt"&&o!=="meta"&&s.push(o);const c=s.join("+");s.length>1&&(e.target.value=c,this.saveShortcut(t,c))}saveShortcut(e,t){const o={shortcutToggle:"toggleExtension",shortcutNext:"forceNextEpisode",shortcutSkip:"manualSkipIntro"}[e];o&&(this.settings.shortcuts[o]=t,chrome.storage.sync.set({shortcuts:this.settings.shortcuts}),this.showFeedback(`Shortcut updated: ${t}`))}resetSettings(){const e={autoSkipIntro:!0,autoSkipCredits:!0,autoSkipRecap:!0,autoNextEpisode:!0,skipDelay:1e3,nextEpisodeDelay:0,showNotifications:!0,shortcuts:{toggleExtension:"ctrl+shift+s",forceNextEpisode:"ctrl+shift+n",manualSkipIntro:"ctrl+shift+i"}};this.settings=e,chrome.storage.sync.set(e),this.updateUI(),this.showFeedback("Settings reset to defaults")}showFeedback(e){const t=document.createElement("div");t.className="feedback",t.textContent=e,t.style.cssText=`
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
    `,document.body.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.3s ease",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300)},3e3)}}const d=document.createElement("style");d.textContent=`
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
`;document.head.appendChild(d);document.addEventListener("DOMContentLoaded",()=>{new u});
