# GratiJar 🪴✨

**One sentence a day to fill your jar of gratitude.**

GratiJar is a minimalist web app that helps you cultivate a daily gratitude practice without the overwhelm of traditional journaling apps. Simply write one sentence per day about something you're grateful for, and watch your jar fill up over time.

![GratiJar Preview](https://via.placeholder.com/800x400/4C1D95/FFFFFF?text=GratiJar+Preview)

## 🌟 Features

- **Daily Gratitude**: Record one sentence per day about something you're grateful for.
- **Visual Jar**: See your notes collect in a beautiful virtual jar that fills over time.
- **Zero Effort**: No accounts, no passwords - just write and go. Data saves locally in your browser.
- **Rewind Mode**: Shuffle through past entries with a delightful animation.
- **Export**: View all your gratitude notes organized by month and year.
- **Helpful Suggestions**: Get thoughtful gratitude prompts to inspire your daily practice.

## 🔧 Technology

Built with pure HTML, CSS, and JavaScript:

- **Frontend**: HTML5, TailwindCSS for styling, CSS animations
- **Storage**: localStorage (no backend required)
- **Animations**: Pure CSS animations for the jar, notes, and transitions

## 🚀 Getting Started

### Running Locally

1. Clone this repository
2. Open `index.html` in your web browser
3. Start recording your daily gratitude!

```bash
# Clone the repository
git clone https://github.com/yourusername/gratijar.git

# Navigate to the project directory
cd gratijar

# Open in your browser
open index.html  # on macOS
# or
xdg-open index.html  # on Linux
# or simply double-click the file in your file explorer
```

### Deployment

The app can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- Any web server that can serve static files

## 🎨 Customization

The app uses CSS variables for colors and animations, making it easy to customize:

```css
:root {
  --bg-gradient-start: #312e81;
  --bg-gradient-end: #4c1d95;
  --primary: #c084fc;
  --primary-light: #e9d5ff;
  --primary-dark: #7e22ce;
  --accent: #f0abfc;
  --accent-light: #f5d0fe;
  --accent-glow: rgba(240, 171, 252, 0.6);
  --glass: rgba(146, 109, 222, 0.15);
  --glass-border: rgba(168, 141, 230, 0.3);
  --note-colors: #f0abfc, #c084fc, #a78bfa, #818cf8, #60a5fa;
}
```

## 📝 How It Works

1. **Write**: Enter your daily gratitude note in the text area
2. **Save**: Click the arrow or press Enter to save your note
3. **Watch**: See your note float down into the jar
4. **Revisit**: Click the "Shuffle Memories" button to see past notes
5. **Export**: Use the export button to view all your notes organized by month

## 🔒 Privacy

GratiJar respects your privacy:

- No data is sent to any server
- All your notes are stored only in your browser's localStorage
- No analytics or tracking
- No API keys or external services required

## 🌱 Future Ideas

- Jar themes (glass, clay, neon)
- PDF export for gratitude yearbooks
- Reminder notifications (browser notifications)
- Dark/light mode themes

## 📄 License

[MIT License](LICENSE)

## 🙏 Acknowledgments

- Inspired by the concept of gratitude jars in mindfulness practices
- Thanks to all who believe in the power of daily gratitude 

## Deployment on Vercel

This app is set up to be easily deployed on Vercel.

### Steps to deploy:

1. **Fork or clone this repository**

2. **Sign up for a Vercel account** (if you don't have one)
   - Go to [vercel.com](https://vercel.com) and sign up

3. **Deploy on Vercel**
   - Click "New Project" in Vercel
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: (leave empty)
     - Output Directory: (leave empty)
   - Click "Deploy"

4. **Your app is now live!**
   - Vercel will give you a URL to access your app

## Local Development

To run this project locally:

1. Clone the repository
2. Serve the files with a local server (e.g., using Live Server extension in VS Code)

## Security

- The app is a pure static site with no server-side components
- All data is stored locally in the browser
- No external API calls are made 