# 🕵️ The Midnight Bureau: Kigali Files

An immersive **Rwandan Noir** detective experience built with **Three.js**. Explore a mysterious desk in 1950s Kigali, uncover hidden clues, and solve the Gishwati Mystery through interactive 3D objects.

![Film Noir Badge](https://img.shields.io/badge/Genre-Film%20Noir-black?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-0.160-green?style=for-the-badge)
![Rwanda](https://img.shields.io/badge/Setting-Kigali-blue?style=for-the-badge)

*Challenge project for Global Hack Week: Beginners 2026*

---

## 🌍 Concept

This project fuses **global Noir aesthetics** with **Rwandan cultural elements**—creating a unique "Kigali Noir" experience. Instead of a generic detective story, you're immersed in a richly textured world featuring:

- **Imigongo patterns** (traditional Rwandan geometric art)
- **Gorilla Coffee** (a nod to Rwanda's renowned coffee culture)
- **The Gishwati Mystery** (inspired by Rwanda's lush forests)
- **Dramatic lighting** casting deep shadows on a mahogany desk

---

## ✨ Features

### 🎨 Visual Style
- **Film noir grayscale filter** with high contrast
- **Cinematic spot lighting** creating dramatic shadows
- **Soft shadow mapping** for atmospheric depth
- **Scanline effects** for vintage film aesthetic

### 🖱️ Interactions
- **Drag objects** across the desk surface (folder, Imigongo box)
- **Hover effects** with subtle emissive glow
- **Click feedback** with smooth scale animations
- **Physics-constrained movement** (objects stay on desk)

### 🎭 Rwandan Elements
- **Case folder** labeled "The Gishwati Mystery"
- **Hidden note** with clues in Kinyarwanda/English
- **Imigongo-patterned box** representing traditional art
- **Gorilla Coffee tin** celebrating Rwanda's coffee heritage
- **Vintage desk lamp** for atmospheric lighting

### 🏆 Win Condition
Move the folder to reveal the hidden note and unlock the story popup about Rwanda's history and mystery.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add textures** (see [Assets Setup](#-assets-setup) below)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** to the URL shown (typically `http://localhost:5173`)

---

## 📦 Assets Setup

### Required Textures

Create or download the following images and place them in `assets/textures/`:

1. **`imigongo_pattern.jpg`** (512x512 or higher)
   - Traditional Rwandan geometric patterns
   - Colors: terracotta, black, white
   - Source: Search for "Imigongo art Rwanda" or create your own geometric pattern
   - Example: [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Imigongo)

2. **`coffee_label.jpg`** (512x512)
   - Vintage coffee tin label design
   - Text: "Gorilla Coffee" or "Rwanda Coffee"
   - Style: 1950s typography
   - Colors: brown, cream, black

3. **`note_texture.png`** (512x768)
   - Aged paper background with handwritten text
   - Sample text (in Kinyarwanda/English):
     ```
     Ubwami bw'amazi
     Meet at the Volcanoes
     23:00 - The mist will hide us
     Bring the Imigongo map
     ```
   - Style: Vintage paper, coffee stains, noir aesthetic

### Optional Audio

Place in `assets/sounds/`:
- **`kigali_rain.mp3`** - Low-fi rain ambience or jazz loop (not yet implemented in code, ready for expansion)

### Quick Start Without Custom Textures

The application will run with **fallback colors** if textures are missing:
- Imigongo box: Terracotta orange
- Coffee tin: Dark brown
- Note: Cream paper color

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Three.js** | 3D rendering engine |
| **Vite** | Fast development server and build tool |
| **JavaScript (ES6+)** | Core programming language |
| **CSS3** | Film noir filters and UI styling |


---

## 🎮 How to Play

1. **Launch the experience** - The scene loads with a dramatic spotlight on the detective's desk
2. **Explore objects** - Hover over the folder and Imigongo box to see them glow
3. **Drag the folder** - Click and drag the manila folder to the right
4. **Reveal the clue** - When the folder moves far enough, a hidden note appears
5. **Read the story** - A popup reveals the next chapter of the Gishwati Mystery

### Controls
- **Mouse move** - Hover to highlight interactive objects
- **Left click + drag** - Move folder and Imigongo box across desk
- **Click** - Examine objects (visual feedback)

---

## 🎨 Customization Guide

### Adjust the Noir Filter
Edit [src/style.css](src/style.css):
```css
#three-canvas {
    filter: grayscale(100%) contrast(130%) brightness(90%);
}
```

### Change Lighting Intensity
Edit [src/main.js](src/main.js):
```javascript
const spotLight = new THREE.SpotLight(0xfff5e1, 3); // Increase '3' for brighter light
spotLight.angle = Math.PI / 6; // Widen the cone
```

### Modify Win Condition
Edit [src/main.js](src/main.js):
```javascript
if (folder.position.x > -0.5) { // Change threshold
    showStoryPopup("Your Title", "Your story text...");
}
```

### Add More Objects
In [src/main.js](src/main.js), after the coffee tin:
```javascript
const newObject = new THREE.Mesh(geometry, material);
newObject.position.set(x, y, z);
newObject.name = 'myObject';
scene.add(newObject);
interactiveObjects.push(newObject); // Make it draggable
```

---

## 🌟 Rwandan Cultural Context

### Imigongo Art
- Traditional art form originating from eastern Rwanda
- Features geometric patterns made from cow dung
- Colors: black, white, red-brown
- Symbolizes unity and cultural heritage

### Coffee Culture
- Rwanda is famous for high-quality Arabica coffee
- "Gorilla Coffee" references mountain gorillas in Volcanoes National Park
- Coffee ceremonies are an important social ritual

### Gishwati Forest
- One of Rwanda's protected rainforests
- Home to diverse wildlife including chimpanzees
- Setting for the fictional "Gishwati Mystery"

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to GitHub Pages, Netlify, or Vercel
1. Push your `dist` folder to your hosting service
2. Ensure `assets/` folder is included
3. Set base path in `vite.config.js` if needed

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Black screen** | Check browser console for errors. Ensure Three.js is installed. |
| **Textures not loading** | Verify file paths are correct. Check browser network tab. |
| **Objects won't drag** | Make sure objects are added to `interactiveObjects` array. |
| **Performance issues** | Lower shadow map resolution in main.js (e.g., 1024 instead of 2048). |

---

## 📚 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Imigongo Art](https://en.wikipedia.org/wiki/Imigongo)
- [Rwanda Tourism](https://www.visitrwanda.com/)
- [Film Noir Cinematography](https://www.studiobinder.com/blog/what-is-film-noir/)

---

## 🙏 Credits

- **Concept**: Kigali Noir - Fusion of global noir with Rwandan culture
- **Art Style**: Film noir aesthetics + Rwandan traditional patterns
- **Technology**: Three.js, Vite, Modern JavaScript

---

## 🎬 Screenshots & Demo

*(Add your screenshots here after running the project)*

Run the project and capture:
1. The initial desk view with spotlight
2. Hovering over the folder
3. The revealed note
4. The story popup

---

**Enjoy your journey into The Midnight Bureau! 🕵️🇷🇼**
