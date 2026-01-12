# Audio Assets Guide

This folder is for optional audio files to enhance the noir atmosphere.

## Optional Audio Files

### 1. kigali_rain.mp3
**Description**: Ambient rain sound or low-fi jazz loop
**Duration**: 2-5 minutes (loopable)
**Style**: Subtle, atmospheric
**Options**:
- Light rain falling on tin roofs
- Distant thunder with rain
- 1950s jazz with rain ambience
- Low-fi noir jazz instrumental

**Where to find**:
- [Freesound.org](https://freesound.org/) - Search "rain ambient"
- [YouTube Audio Library](https://www.youtube.com/audiolibrary) - Free music
- [Incompetech](https://incompetech.com/) - Royalty-free jazz

---

## How to Add Audio (Future Enhancement)

Currently, audio is not implemented in the code, but the infrastructure is ready. To add audio:

1. Place `kigali_rain.mp3` in this folder
2. Add to [src/main.js](../../src/main.js):
   ```javascript
   // Audio setup
   const listener = new THREE.AudioListener();
   camera.add(listener);
   
   const sound = new THREE.Audio(listener);
   const audioLoader = new THREE.AudioLoader();
   audioLoader.load('/assets/sounds/kigali_rain.mp3', (buffer) => {
       sound.setBuffer(buffer);
       sound.setLoop(true);
       sound.setVolume(0.3);
       sound.play();
   });
   ```

3. Add volume controls in the UI

---

## Audio Attribution

If you use audio from free sources, remember to:
- Check the license (CC0, CC-BY, etc.)
- Provide attribution if required
- Keep a credits file listing audio sources

---

**Note**: Audio files can be large. Consider using compressed formats (MP3 at 128kbps) to keep file sizes manageable.
