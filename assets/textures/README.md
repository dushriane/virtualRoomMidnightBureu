# Texture Assets Guide

This folder should contain the following texture images for The Midnight Bureau: Kigali Files

## Required Textures

### 1. imigongo_pattern.jpg (512x512 or higher)
**Description**: Traditional Rwandan geometric art pattern
**Colors**: Terracotta red, black, white
**Style**: Geometric patterns (triangles, diamonds, curves)
**Where to find**:
- Search "Imigongo art Rwanda" on Google Images
- Visit Wikimedia Commons: https://commons.wikimedia.org/wiki/Category:Imigongo
- Create your own using geometric design tools

**Alternative**: The app will use a fallback terracotta color (#cc6644) if this file is missing.

---

### 2. coffee_label.jpg (512x512)
**Description**: Vintage coffee tin label
**Text**: "Gorilla Coffee" or "Rwanda Premium Coffee"
**Style**: 1950s typography, vintage label design
**Colors**: Brown, cream, black
**Elements**: 
- Coffee beans illustration
- "Product of Rwanda" text
- Vintage stamps or seals

**Where to create**:
- Use Canva or Photoshop
- Look for vintage label templates
- Reference 1950s coffee packaging

**Alternative**: The app will use a dark brown color (#3d2817) if this file is missing.

---

### 3. note_texture.png (512x768)
**Description**: Handwritten note with clues
**Background**: Aged paper texture (cream/yellow)
**Text content** (handwritten style):
```
THE GISHWATI MYSTERY

Ubwami bw'amazi...

Meet at the Volcanoes National Park
Tomorrow, 23:00

The mist will hide us.
Bring the Imigongo map.

- K.
```

**Style**: 
- Handwritten font or actual handwriting
- Coffee stains (brown circles)
- Slightly crumpled/aged appearance
- Noir detective aesthetic

**Where to create**:
- Use a photo editor to add text to aged paper texture
- Download free paper textures from TextureHaven or similar
- Add coffee stain brushes in Photoshop/GIMP

**Alternative**: The app will use a cream color (#fffff0) if this file is missing.

---

## How to Add Textures

1. Create or download the images
2. Save them to this folder (`assets/textures/`)
3. Ensure the filenames match exactly:
   - `imigongo_pattern.jpg`
   - `coffee_label.jpg`
   - `note_texture.png`
4. Restart your development server (`npm run dev`)

---

## Free Resources

**Texture Websites**:
- [Texture Haven](https://texturehaven.com/) - Free paper textures
- [Unsplash](https://unsplash.com/) - High-quality photos
- [Wikimedia Commons](https://commons.wikimedia.org/) - Imigongo art

**Design Tools**:
- [Canva](https://www.canva.com/) - Easy label design
- [GIMP](https://www.gimp.org/) - Free Photoshop alternative
- [Photopea](https://www.photopea.com/) - Online photo editor

**Fonts** (for the note):
- "Rock Salt" (Google Fonts) - Handwritten style
- "Special Elite" (Google Fonts) - Typewriter noir
- "Permanent Marker" (Google Fonts) - Bold handwriting

---

## Testing Without Textures

The application is designed to work without custom textures by using fallback colors. However, adding textures will dramatically improve the visual experience and cultural authenticity of the Kigali Noir theme.

---

**Pro tip**: For the note texture, you can even write the text by hand, photograph it, and use that photo as the texture for maximum authenticity!
