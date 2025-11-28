// Idea Drip - Popup Script
// Handles loading and displaying random ideas, questions, and thoughts

document.addEventListener('DOMContentLoaded', () => {
  loadContent();

  // Refresh button listener
  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadContent();
  });

  // Test button listener - triggers droplet on active tab
  document.getElementById('testBtn').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.id && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        chrome.tabs.sendMessage(tab.id, { action: 'showDroplet' }, (response) => {
          if (chrome.runtime.lastError) {
            showTestMessage('Could not show droplet on this page');
          } else {
            showTestMessage('Droplet triggered! Check your tab.');
            // Close popup after brief delay
            setTimeout(() => window.close(), 1000);
          }
        });
      } else {
        showTestMessage('Cannot show droplet on this page');
      }
    } catch (error) {
      console.error('Error testing droplet:', error);
      showTestMessage('Error triggering droplet');
    }
  });
});

// Show a temporary message on the test button
function showTestMessage(message) {
  const testBtn = document.getElementById('testBtn');
  const originalText = testBtn.textContent;
  testBtn.textContent = message;
  setTimeout(() => {
    testBtn.textContent = originalText;
  }, 2000);
}

// Load content from ideas.json
async function loadContent() {
  const contentDiv = document.getElementById('content');
  
  try {
    contentDiv.innerHTML = '<div class="loading">Loading inspiration...</div>';

    const response = await fetch(chrome.runtime.getURL('data/ideas.json'));
    
    if (!response.ok) {
      throw new Error('Failed to load ideas');
    }

    const data = await response.json();

    const idea = getRandomItem(data.ideas);
    const question = getRandomItem(data.questions);
    const thought = getRandomItem(data.thoughts);

    contentDiv.innerHTML = `
      <div class="content-section idea-section">
        <div class="section-label">
          <span class="icon">💡</span>
          <span>Idea</span>
        </div>
        <p class="section-text">${escapeHtml(idea)}</p>
      </div>

      <div class="content-section question-section">
        <div class="section-label">
          <span class="icon">❓</span>
          <span>Question</span>
        </div>
        <p class="section-text">${escapeHtml(question)}</p>
      </div>

      <div class="content-section thought-section">
        <div class="section-label">
          <span class="icon">💭</span>
          <span>Thought</span>
        </div>
        <p class="section-text">${escapeHtml(thought)}</p>
      </div>
    `;

  } catch (error) {
    console.error('Error loading content:', error);
    contentDiv.innerHTML = `
      <div class="error">
        <p>Could not load ideas.</p>
        <p style="font-size: 12px; margin-top: 8px;">Please try again later.</p>
      </div>
    `;
  }
}

// Get random item from array
function getRandomItem(array) {
  if (!array || array.length === 0) {
    return 'No content available';
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
