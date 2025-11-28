// Idea Drip - Background Service Worker
// Handles alarms and triggers droplet injection

const ALARM_NAME = 'ideaDripAlarm';
const ALARM_INTERVAL_MINUTES = 60;

// Create alarm when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Idea Drip extension installed');
  createAlarm();
});

// Create alarm when service worker starts
chrome.runtime.onStartup.addListener(() => {
  console.log('Idea Drip service worker started');
  createAlarm();
});

// Create the hourly alarm
function createAlarm() {
  chrome.alarms.get(ALARM_NAME, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: ALARM_INTERVAL_MINUTES,
        periodInMinutes: ALARM_INTERVAL_MINUTES
      });
      console.log(`Alarm created: fires every ${ALARM_INTERVAL_MINUTES} minutes`);
    }
  });
}

// Listen for alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('Idea Drip alarm triggered');
    triggerDroplet();
  }
});

// Trigger droplet on the active tab
async function triggerDroplet() {
  try {
    // Get the active tab in the current window
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.id && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      // Send message to content script to show droplet
      chrome.tabs.sendMessage(tab.id, { action: 'showDroplet' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Could not send message to tab:', chrome.runtime.lastError.message);
        } else {
          console.log('Droplet triggered successfully');
        }
      });
    }
  } catch (error) {
    console.error('Error triggering droplet:', error);
  }
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'testDroplet') {
    // For testing: manually trigger droplet
    triggerDroplet();
    sendResponse({ success: true });
  }
  return true;
});
