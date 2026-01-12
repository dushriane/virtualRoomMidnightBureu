# 🚀 Quick Start Guide

Welcome to **The Midnight Bureau: Kigali Files**! Follow these steps to get your noir detective experience running.

## Step 1: Install Dependencies

Open a terminal in this folder and run:

```bash
npm install
```

This will install:
- Three.js (3D rendering)
- Vite (development server)

---

## Step 2: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 3: Open in Browser

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the loading screen, then the detective's desk

---

## Step 4: Interact with the Scene

- **Hover** over the folder and Imigongo box to see them glow
- **Click and drag** the folder to the right
- **Discover** the hidden note and unlock the mystery!

---

## 🎨 Add Textures (Optional but Recommended)

The scene works with fallback colors, but textures make it authentic:

1. **Create or find textures** for:
   - Imigongo pattern (Rwandan geometric art)
   - Coffee label (vintage design)
   - Handwritten note (aged paper)

2. **Place them in** `assets/textures/`:
   - `imigongo_pattern.jpg`
   - `coffee_label.jpg`
   - `note_texture.png`

3. **Restart the server** to see the textures load

See [assets/textures/README.md](assets/textures/README.md) for detailed texture creation guides.

---

## 🛠️ Troubleshooting

### Black screen?
- Check the browser console (F12) for errors
- Ensure Node.js is installed (`node --version`)
- Try `npm install` again

### Textures not showing?
- Check file names match exactly (case-sensitive)
- Verify files are in `assets/textures/`
- Check browser network tab (F12) for 404 errors

### Port already in use?
- Vite will automatically try another port
- Or specify a port: `npm run dev -- --port 3000`

---

## 📦 Build for Production

When ready to deploy:

```bash
npm run build
```

Your optimized files will be in the `dist/` folder.

---

## 🎓 Next Steps

- **Customize**: Edit [src/main.js](src/main.js) to add more objects
- **Style**: Adjust noir filters in [src/style.css](src/style.css)
- **Expand**: Add audio, more mysteries, or mobile support
- **Deploy**: Push to GitHub Pages, Netlify, or Vercel

---

## 📚 Full Documentation

See [README.md](README.md) for:
- Complete feature list
- Customization guide
- Rwandan cultural context
- Deployment instructions
- Learning resources

---

**Enjoy your journey into Kigali Noir! 🕵️🇷🇼**

Need help? Check the README or open an issue on GitHub.
