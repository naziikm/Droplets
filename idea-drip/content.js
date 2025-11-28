// Idea Drip - Content Script
// Handles droplet animation and display on web pages

(function() {
  'use strict';

  const DROPLET_DURATION = 8000; // Auto-remove after 8 seconds
  const ANIMATION_DURATION = 3000; // Fall animation duration

  let dropletElement = null;
  let audioElement = null;

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showDroplet') {
      showDroplet();
      sendResponse({ success: true });
    }
    return true;
  });

  // Create and show the droplet
  function showDroplet() {
    // Remove existing droplet if any
    removeDroplet();

    // Create droplet container
    dropletElement = document.createElement('div');
    dropletElement.id = 'idea-drip-droplet';
    dropletElement.className = 'idea-drip-droplet';

    // Create droplet SVG
    const dropletSvg = document.createElement('img');
    dropletSvg.src = chrome.runtime.getURL('assets/droplet.svg');
    dropletSvg.alt = 'Idea Droplet';
    dropletSvg.className = 'idea-drip-droplet-svg';

    // Create glow effect
    const glowEffect = document.createElement('div');
    glowEffect.className = 'idea-drip-glow';

    dropletElement.appendChild(glowEffect);
    dropletElement.appendChild(dropletSvg);

    // Add click listener to open popup
    dropletElement.addEventListener('click', handleDropletClick);

    // Add to page
    document.body.appendChild(dropletElement);

    // Play sound
    playDropletSound();

    // Trigger animation after a brief delay for CSS transition
    requestAnimationFrame(() => {
      dropletElement.classList.add('idea-drip-falling');
    });

    // Auto-remove after duration
    setTimeout(() => {
      removeDroplet();
    }, DROPLET_DURATION);
  }

  // Handle droplet click
  function handleDropletClick(event) {
    event.preventDefault();
    event.stopPropagation();

    // Add click effect
    if (dropletElement) {
      dropletElement.classList.add('idea-drip-clicked');
    }

    // Open the extension popup by sending a message
    chrome.runtime.sendMessage({ action: 'openPopup' }, (response) => {
      // Remove droplet after click
      setTimeout(() => {
        removeDroplet();
      }, 300);
    });

    // As a fallback, show inline content since we can't programmatically open popup
    showInlineIdea();
  }

  // Show idea inline (fallback when popup can't be opened programmatically)
  async function showInlineIdea() {
    try {
      const response = await fetch(chrome.runtime.getURL('data/ideas.json'));
      const data = await response.json();

      const idea = getRandomItem(data.ideas);
      const question = getRandomItem(data.questions);
      const thought = getRandomItem(data.thoughts);

      // Create inline popup
      const inlinePopup = document.createElement('div');
      inlinePopup.id = 'idea-drip-inline-popup';
      inlinePopup.className = 'idea-drip-inline-popup';

      inlinePopup.innerHTML = `
        <div class="idea-drip-inline-header">
          <span class="idea-drip-inline-title">💧 Idea Drip</span>
          <button class="idea-drip-inline-close">&times;</button>
        </div>
        <div class="idea-drip-inline-content">
          <div class="idea-drip-inline-section idea-drip-idea">
            <span class="idea-drip-inline-label">💡 Idea</span>
            <p>${idea}</p>
          </div>
          <div class="idea-drip-inline-section idea-drip-question">
            <span class="idea-drip-inline-label">❓ Question</span>
            <p>${question}</p>
          </div>
          <div class="idea-drip-inline-section idea-drip-thought">
            <span class="idea-drip-inline-label">💭 Thought</span>
            <p>${thought}</p>
          </div>
        </div>
      `;

      // Add close functionality
      const closeBtn = inlinePopup.querySelector('.idea-drip-inline-close');
      closeBtn.addEventListener('click', () => {
        inlinePopup.remove();
      });

      // Close on outside click
      inlinePopup.addEventListener('click', (e) => {
        if (e.target === inlinePopup) {
          inlinePopup.remove();
        }
      });

      document.body.appendChild(inlinePopup);

      // Auto-remove after 30 seconds
      setTimeout(() => {
        if (document.body.contains(inlinePopup)) {
          inlinePopup.remove();
        }
      }, 30000);

    } catch (error) {
      console.error('Error loading ideas:', error);
    }
  }

  // Get random item from array
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Play droplet sound
  function playDropletSound() {
    try {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      audioElement = new Audio(chrome.runtime.getURL('assets/sound.mp3'));
      audioElement.volume = 0.3; // Soft sound
      audioElement.play().catch(err => {
        console.log('Could not play sound:', err.message);
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }

  // Remove droplet from page
  function removeDroplet() {
    if (dropletElement) {
      dropletElement.classList.add('idea-drip-fade-out');
      setTimeout(() => {
        if (dropletElement && dropletElement.parentNode) {
          dropletElement.parentNode.removeChild(dropletElement);
        }
        dropletElement = null;
      }, 300);
    }
  }

})();
