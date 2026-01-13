import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initInteraction, updateInteraction, showStoryPopup } from './interaction.js';

// ============================================
// SCENE SETUP
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a); // Deep noir black
scene.fog = new THREE.Fog(0x0a0a0a, 10, 25); // Atmospheric fog

// Camera - Angled view for better depth perception
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(0, 6, 12); // Lower and further back for better view
camera.lookAt(0, 0, 0);

// Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft cinematic shadows

// Orbit Controls for rotating view
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // Look at desk center
controls.minDistance = 5;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2.2; // Don't go below desk

// ============================================
// LIGHTING (Dramatic Noir Cone)
// ============================================
const spotLight = new THREE.SpotLight(0xfff5e1, 4); // Warm lamp color (increased intensity)
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 4; // Wider cone for better coverage
spotLight.penumbra = 0.3; // Soft edges
spotLight.decay = 2;
spotLight.distance = 25;

// Shadow quality
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 5;
spotLight.shadow.camera.far = 15;

scene.add(spotLight);

// Ambient light (increased for visibility)
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

// Development lights for better visibility (can be adjusted later)
const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
frontLight.position.set(0, 5, 10);
scene.add(frontLight);

const sideLight = new THREE.PointLight(0xffa500, 0.8, 30);
sideLight.position.set(8, 4, 5);
scene.add(sideLight);

// ============================================
// TEXTURE LOADER
// ============================================
const textureLoader = new THREE.TextureLoader();

// Load textures with error handling
const loadTexture = (path, fallbackColor) => {
    return new Promise((resolve) => {
        textureLoader.load(
            path,
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                resolve(texture);
            },
            undefined,
            () => {
                console.warn(`Texture not found: ${path}, using fallback`);
                resolve(null);
            }
        );
    });
};

// ============================================
// THE DESK (Dark Wood Surface with Legs)
// ============================================
const deskMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2b1810, // Deep mahogany
    roughness: 0.8,
    metalness: 0.1
});

// Desk top
const deskTopGeometry = new THREE.BoxGeometry(12, 0.3, 8);
const deskTop = new THREE.Mesh(deskTopGeometry, deskMaterial);
deskTop.position.y = 0;
deskTop.receiveShadow = true;
deskTop.castShadow = true;
scene.add(deskTop);

// Desk legs (4 corners)
const legGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 16);
const legPositions = [
    [-5, -1.4, 3.5],  // Front left
    [5, -1.4, 3.5],   // Front right
    [-5, -1.4, -3.5], // Back left
    [5, -1.4, -3.5]   // Back right
];

legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, deskMaterial);
    leg.position.set(...pos);
    leg.castShadow = true;
    scene.add(leg);
});

// ============================================
// RWANDAN OBJECTS
// ============================================
export const interactiveObjects = [];
export let folder, imigongoBox; // Export for interaction

// 1. THE FOLDER (Case File)
const folderGeometry = new THREE.BoxGeometry(2.5, 0.05, 3.5);
const folderMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd4a574, // Manila folder color
    roughness: 0.9
});
folder = new THREE.Mesh(folderGeometry, folderMaterial);
folder.position.set(-3, 0.2, 0);
folder.castShadow = true;
folder.name = 'folder';
folder.userData.clueText = "THE GISHWATI MYSTERY\n\nAgent's Note:\n'The witness spoke of strange lights near Lake Kivu. The Imigongo box may hold the key. Check the traditional patterns - they're not just art, they're a map.'\n\n- Bureau Chief K.";
scene.add(folder);
interactiveObjects.push(folder);

// Folder label
const labelGeometry = new THREE.PlaneGeometry(2, 0.4);
const labelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    emissive: 0x333333
});
const label = new THREE.Mesh(labelGeometry, labelMaterial);
label.position.set(0, 0.03, 0);
label.rotation.x = -Math.PI / 2;
folder.add(label);

// 2. THE HIDDEN NOTE (Clue under the folder)
const noteGeometry = new THREE.PlaneGeometry(2, 2.5);
let noteMaterial;

(async () => {
    const noteTexture = await loadTexture('/assets/textures/note_texture.png');
    noteMaterial = new THREE.MeshStandardMaterial({ 
        map: noteTexture,
        color: 0xfffff0, // Aged paper
        roughness: 1.0
    });
    
    const note = new THREE.Mesh(noteGeometry, noteMaterial);
    note.position.set(-3, 0.16, 0); // Just under the folder
    note.rotation.x = -Math.PI / 2;
    note.receiveShadow = true;
    note.name = 'note';
    scene.add(note);
    
    // Store reference for win condition
    folder.userData.hidesNote = note;
})();

// 3. IMIGONGO PATTERNED BOX (Rwandan Art)
const imigongoGeometry = new THREE.BoxGeometry(1.5, 1.2, 1.5);
let imigongoMaterial;

(async () => {
    const imigongoTexture = await loadTexture('/assets/textures/imigongo_pattern.jpg');
    imigongoMaterial = new THREE.MeshStandardMaterial({ 
        map: imigongoTexture,
        color: imigongoTexture ? 0xffffff : 0xcc6644, // Terracotta fallback
        roughness: 0.6,
        metalness: 0.2
    });
    
    imigongoBox = new THREE.Mesh(imigongoGeometry, imigongoMaterial);
    imigongoBox.position.set(3, 0.75, -2);
    imigongoBox.castShadow = true;
    imigongoBox.rotation.y = Math.PI / 8;
    imigongoBox.name = 'imigongoBox';
    
    // Hidden artifact inside the box (golden amulet)
    const amuletGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const amuletMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Gold
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xaa8800,
        emissiveIntensity: 0.3
    });
    const amulet = new THREE.Mesh(amuletGeometry, amuletMaterial);
    amulet.position.set(0, -0.3, 0); // Hidden inside
    amulet.rotation.x = Math.PI / 2;
    amulet.name = 'amulet';
    amulet.visible = false; // Hidden initially
    imigongoBox.add(amulet);
    imigongoBox.userData.hiddenAmulet = amulet;
    imigongoBox.userData.clueText = "A golden amulet emerges from the Imigongo box!\n\nInscription: 'Ubumwe - Unity'\n\nThis ancient artifact was said to guide travelers through the mist-covered mountains of Volcanoes National Park. The patterns match the missing map coordinates.";
    
    scene.add(imigongoBox);
    interactiveObjects.push(imigongoBox);
})();

// 4. GORILLA COFFEE TIN
const coffeeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32);
let coffeeMaterial;

(async () => {
    const coffeeTexture = await loadTexture('/assets/textures/coffee_label.jpg');
    coffeeMaterial = new THREE.MeshStandardMaterial({ 
        map: coffeeTexture,
        color: coffeeTexture ? 0xffffff : 0x3d2817, // Dark brown fallback
        roughness: 0.4,
        metalness: 0.6
    });
    
    const coffeeTin = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffeeTin.position.set(4, 0.75, 2);
    coffeeTin.castShadow = true;
    coffeeTin.name = 'coffeeTin';
    scene.add(coffeeTin);
})();

// 5. DESK LAMP (Visual element)
const lampBaseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16);
const lampBaseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.2
});
const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
lampBase.position.set(-5, 0.25, -3);
lampBase.castShadow = true;
scene.add(lampBase);

const lampArmGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
const lampArm = new THREE.Mesh(lampArmGeometry, lampBaseMaterial);
lampArm.position.set(0, 2, 0);
lampArm.rotation.z = -Math.PI / 6;
lampBase.add(lampArm);

// ============================================
// INTERACTION SYSTEM
// ============================================
initInteraction(camera, interactiveObjects, renderer.domElement);

// ============================================
// WIN CONDITION CHECKER
// ============================================
let mysteryRevealed = false;

function checkWinCondition() {
    if (mysteryRevealed) return;
    
    // Check if folder has been moved significantly
    if (folder.position.x > -0.5) {
        mysteryRevealed = true;
        showStoryPopup(
            "The Gishwati Mystery",
            "You uncover a handwritten note: 'Meet at the Volcanoes National Park, 23:00. " +
            "The mist will hide us. Bring the Imigongo map.' " +
            "The plot thickens in the heart of Rwanda..."
        );
    }
}

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
    requestAnimationFrame(animate);
    
    // Update orbit controls
    controls.update();
    
    // Update interaction system
    updateInteraction();
    
    // Check win condition
    checkWinCondition();
    
    // Render
    renderer.render(scene, camera);
}

// ============================================
// WINDOW RESIZE
// ============================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// INITIALIZATION
// ============================================
// Hide loading screen after a short delay
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}, 1500);

// Start animation
animate();

console.log('🕵️ The Midnight Bureau: Kigali Files initialized');
console.log('💡 Move the folder to reveal the mystery...');
