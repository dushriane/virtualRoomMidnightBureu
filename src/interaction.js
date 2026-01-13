import * as THREE from 'three';

// ============================================
// DRAG INTERACTION SYSTEM
// ============================================
let camera, interactiveObjects, canvas;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isDragging = false;
let selectedObject = null;
let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // XZ plane at desk height
let intersection = new THREE.Vector3();
let offset = new THREE.Vector3();

// Visual feedback
let outlineMaterial = null;
let hoveredObject = null;

/**
 * Initialize the interaction system
 */
export function initInteraction(cam, objects, canvasElement) {
    camera = cam;
    interactiveObjects = objects;
    canvas = canvasElement;
    
    // Event listeners
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);
    
    console.log('🖱️ Interaction system initialized');
}

/**
 * Update mouse coordinates
 */
function updateMouseCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

/**
 * Mouse move handler
 */
function onMouseMove(event) {
    updateMouseCoordinates(event);
    
    if (isDragging && selectedObject) {
        // Cast ray to drag plane
        raycaster.setFromCamera(mouse, camera);
        
        if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
            // Apply offset and constrain to desk
            selectedObject.position.copy(intersection.sub(offset));
            
            // Constrain movement to desk surface (XZ only)
            selectedObject.position.y = selectedObject.userData.originalY || 0.2;
            
            // Keep objects within desk bounds
            const deskBounds = { x: 5.5, z: 3.5 };
            selectedObject.position.x = Math.max(-deskBounds.x, Math.min(deskBounds.x, selectedObject.position.x));
            selectedObject.position.z = Math.max(-deskBounds.z, Math.min(deskBounds.z, selectedObject.position.z));
        }
        
        // Change cursor
        canvas.style.cursor = 'grabbing';
    } else {
        // Check for hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            if (hoveredObject !== object) {
                // Remove previous hover effect
                if (hoveredObject) {
                    resetObjectAppearance(hoveredObject);
                }
                
                // Apply hover effect
                hoveredObject = object;
                applyHoverEffect(object);
            }
            
            // Different cursor for lamp (clickable) vs draggable objects
            canvas.style.cursor = object.name === 'lamp' ? 'pointer' : 'grab';
        } else {
            // No hover
            if (hoveredObject) {
                resetObjectAppearance(hoveredObject);
                hoveredObject = null;
            }
            canvas.style.cursor = 'default';
        }
    }
}

/**
 * Mouse down handler
 */
function onMouseDown(event) {
    if (event.button !== 0) return; // Only left click
    
    updateMouseCoordinates(event);
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Don't allow dragging the lamp - it's for clicking only
        if (object.name === 'lamp') {
            return;
        }
        
        isDragging = true;
        selectedObject = object;
        
        // Store original Y position
        if (!selectedObject.userData.originalY) {
            selectedObject.userData.originalY = selectedObject.position.y;
        }
        
        // Calculate intersection point on drag plane
        dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            selectedObject.position
        );
        
        if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
            offset.copy(intersection).sub(selectedObject.position);
        }
        
        // Lift object slightly
        selectedObject.position.y += 0.1;
        
        canvas.style.cursor = 'grabbing';
        event.preventDefault();
    }
}

/**
 * Mouse up handler
 */
function onMouseUp() {
    if (isDragging && selectedObject) {
        // Return object to desk surface
        selectedObject.position.y = selectedObject.userData.originalY || 0.2;
        
        isDragging = false;
        selectedObject = null;
        canvas.style.cursor = 'grab';
    }
}

/**
 * Click handler for non-draggable interactions
 */
function onClick(event) {
    if (isDragging) return;
    
    updateMouseCoordinates(event);
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Play subtle click feedback
        object.scale.set(0.95, 0.95, 0.95);
        setTimeout(() => {
            object.scale.set(1, 1, 1);
        }, 100);
        
        // Handle specific object interactions
        if (object.name === 'folder' && object.userData.clueText) {
            // Show folder clue
            showStoryPopup('Case File Opened', object.userData.clueText);
            console.log('📂 Opened case file');
        } else if (object.name === 'imigongoBox' && object.userData.hiddenAmulet) {
            // Reveal amulet from box
            const amulet = object.userData.hiddenAmulet;
            if (!amulet.visible) {
                amulet.visible = true;
                // Animate amulet rising from box
                animateAmuletReveal(amulet);
                showStoryPopup('Hidden Artifact Discovered!', object.userData.clueText);
                console.log('✨ Amulet revealed!');
            }
        } else if (object.name === 'lamp') {
            // Toggle lamp brightness
            toggleLampBrightness(object);
        }
        
        console.log(`🔍 Examined: ${object.name}`);
    }
}

/**
 * Toggle lamp brightness between 3 states: bright -> dim -> off -> bright
 */
function toggleLampBrightness(lamp) {
    const lampLight = lamp.userData.lampLight;
    const bulbMaterial = lamp.userData.bulbMaterial;
    
    // Cycle through brightness levels: 2 (bright) -> 1 (dim) -> 0 (off) -> 2
    lamp.userData.brightness = (lamp.userData.brightness + 1) % 3;
    
    const brightness = lamp.userData.brightness;
    
    switch(brightness) {
        case 0: // Off
            lampLight.intensity = 0;
            bulbMaterial.emissiveIntensity = 0;
            bulbMaterial.emissive.setHex(0x000000);
            console.log('💡 Lamp turned OFF - Maximum mystery!');
            break;
        case 1: // Dim
            lampLight.intensity = 3;
            bulbMaterial.emissiveIntensity = 0.4;
            bulbMaterial.emissive.setHex(0xff8800);
            console.log('💡 Lamp dimmed - Atmospheric mood');
            break;
        case 2: // Bright
            lampLight.intensity = 8;
            bulbMaterial.emissiveIntensity = 1.0;
            bulbMaterial.emissive.setHex(0xffaa00);
            console.log('💡 Lamp brightened - Better visibility');
            break;
    }
    
    // Visual feedback
    lamp.scale.set(1.1, 1.1, 1.1);
    setTimeout(() => {
        lamp.scale.set(1, 1, 1);
    }, 100);
}

/**
 * Animate amulet rising from the Imigongo box
 */
function animateAmuletReveal(amulet) {
    const startY = -0.3;
    const endY = 1.2;
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        
        amulet.position.y = startY + (endY - startY) * eased;
        amulet.rotation.z += 0.02; // Spin while rising
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

/**
 * Apply hover effect to object
 */
function applyHoverEffect(object) {
    if (!object.userData.originalEmissive) {
        object.userData.originalEmissive = object.material.emissive 
            ? object.material.emissive.clone() 
            : new THREE.Color(0x000000);
    }
    
    object.material.emissive = new THREE.Color(0x443322);
    object.material.emissiveIntensity = 0.3;
}

/**
 * Reset object appearance
 */
function resetObjectAppearance(object) {
    if (object.userData.originalEmissive) {
        object.material.emissive = object.userData.originalEmissive;
        object.material.emissiveIntensity = 0;
    }
}

/**
 * Update function to be called in animation loop
 */
export function updateInteraction() {
    // Any per-frame interaction updates can go here
    // Currently handled by event listeners
}

/**
 * Show story popup overlay
 */
export function showStoryPopup(title, text) {
    const popup = document.getElementById('story-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const closeButton = document.getElementById('close-popup');
    
    popupTitle.textContent = title;
    popupText.textContent = text;
    
    popup.classList.remove('hidden');
    popup.classList.add('visible');
    
    // Close button handler
    closeButton.onclick = () => {
        popup.classList.remove('visible');
        popup.classList.add('hidden');
    };
    
    console.log(`📰 Story revealed: ${title}`);
}

/**
 * Cleanup function
 */
export function cleanup() {
    if (canvas) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('click', onClick);
    }
}
