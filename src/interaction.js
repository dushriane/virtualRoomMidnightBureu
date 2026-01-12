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
            
            canvas.style.cursor = 'grab';
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
        isDragging = true;
        selectedObject = intersects[0].object;
        
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
        
        console.log(`🔍 Examined: ${object.name}`);
    }
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
