# Idea Drip - Chrome Extension

A delightful Chrome extension that delivers a drop of inspiration every hour.

## Features

- 💧 **Hourly Inspiration**: A glowing droplet falls from the top of your screen once every hour
- 🔊 **Soft Sound**: Plays a gentle sound when the droplet appears
- 💡 **Random Ideas**: Click the droplet to see a random idea, question, and thought
- ✨ **Beautiful Animation**: Smooth CSS animations with glowing effects

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `idea-drip` folder

## Project Structure

```
idea-drip/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for alarms
├── content.js             # Droplet animation and display
├── popup/
│   ├── popup.html         # Extension popup UI
│   └── popup.js           # Popup logic
├── styles/
│   └── droplet.css        # Droplet animations
├── data/
│   └── ideas.json         # Collection of ideas, questions, thoughts
└── assets/
    ├── icon16.png         # Extension icon (16x16)
    ├── icon48.png         # Extension icon (48x48)
    ├── icon128.png        # Extension icon (128x128)
    ├── droplet.svg        # Animated droplet graphic
    └── sound.mp3          # Notification sound
```

## Required Assets

Before using the extension, you need to add:

### PNG Icons
Convert the SVG icons to PNG format or create 16x16, 48x48, and 128x128 PNG icons named:
- `assets/icon16.png`
- `assets/icon48.png`
- `assets/icon128.png`

### Sound File
Add a soft notification sound:
- `assets/sound.mp3` - A gentle water drop or chime sound (keep it short, ~1-2 seconds)

You can find free sounds at:
- [Freesound.org](https://freesound.org/search/?q=water+drop)
- [Mixkit](https://mixkit.co/free-sound-effects/water/)

## Usage

1. After installation, the extension will automatically set up an hourly alarm
2. Every hour, a glowing droplet will fall on your current tab
3. Click the droplet to see your inspiration
4. You can also click the extension icon to see random inspiration anytime
5. Use the "Test Droplet Animation" button in the popup to see the droplet immediately

## Testing

To test without waiting an hour:
1. Click the Idea Drip extension icon
2. Click "Test Droplet Animation"
3. Watch the droplet fall on your current tab!

## Customization

### Add More Content
Edit `data/ideas.json` to add your own ideas, questions, and thoughts.

### Change Timing
In `background.js`, modify `ALARM_INTERVAL_MINUTES` to change how often the droplet appears.

### Adjust Animations
Edit `styles/droplet.css` to customize colors, timing, and effects.

## License

MIT License - Feel free to modify and share!
