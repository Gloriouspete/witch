import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPotionBottle, animatePotions } from './potions.js';
import { setupLighting, animateFlames } from './scene-lighting.js';
import { createWoodTexture } from './wood-texture.js';
import { createSign } from './sign.js';
import { initializePurchaseInteractions, handlePotionClick } from './purchase-interaction.js';
import { chemicals } from './chemicals.js';

// Scene setup
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a0f0a);
scene.fog = new THREE.FogExp2(0x1a0f0a, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7, 8);
camera.lookAt(30, -3.4, -92);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 12;
controls.minPolarAngle = Math.PI * 0.3;
controls.maxPolarAngle = Math.PI * 0.6;
controls.minAzimuthAngle = -Math.PI * 0.3;
controls.maxAzimuthAngle = Math.PI * 0.3;
controls.target.set(0, 1.4, -2);

// Initialize purchase interactions
initializePurchaseInteractions(controls);

// Raycaster setup for potion selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(potionObjects, true);

    if (intersects.length > 0) {
        // Find the parent potion object
        let potionObject = intersects[0].object;
        while (potionObject.parent && !potionObject.userData.potionData) {
            potionObject = potionObject.parent;
        }

        if (potionObject.userData.potionData) {
            handlePotionClick(potionObject.userData.potionData, potionObject);
        }
    }
}

// Room and furniture creation functions
function createRoom() {
    const walls = new THREE.Group();

    const woodTexture = new THREE.CanvasTexture(createWoodTexture());
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(12, 8, 0.3),
        new THREE.MeshStandardMaterial({ 
            map: woodTexture,
            roughness: 0.9,
            bumpMap: woodTexture,
            bumpScale: 0.02
        })
    );
    backWall.position.set(0, 4, -4);
    backWall.receiveShadow = true;
    walls.add(backWall);

    const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(12, 8, 0.3),
        new THREE.MeshStandardMaterial({ 
            map: woodTexture,
            roughness: 0.9,
            bumpMap: woodTexture,
            bumpScale: 0.02
        })
    );
    frontWall.position.set(0, 4, 12);
    frontWall.receiveShadow = true;
    walls.add(frontWall);

    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 8, 16),
        new THREE.MeshStandardMaterial({ 
            map: woodTexture,
            roughness: 0.9,
            bumpMap: woodTexture,
            bumpScale: 0.02
        })
    );
    leftWall.position.set(-6, 4, 4);
    leftWall.receiveShadow = true;
    walls.add(leftWall);

    const rightWall = leftWall.clone();
    rightWall.position.set(6, 4, 4);
    walls.add(rightWall);

    const floorTexture = new THREE.CanvasTexture(createWoodTexture(true));
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 16),
        new THREE.MeshStandardMaterial({ 
            map: floorTexture,
            roughness: 0.8,
            metalness: 0.2,
            bumpMap: floorTexture,
            bumpScale: 0.03
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.position.z = 4;
    floor.receiveShadow = true;
    walls.add(floor);

    const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(12, 0.3, 16),
        new THREE.MeshStandardMaterial({ 
            map: woodTexture,
            roughness: 0.9,
            bumpMap: woodTexture,
            bumpScale: 0.02
        })
    );
    ceiling.position.set(0, 8, 4);
    ceiling.receiveShadow = true;
    walls.add(ceiling);

    return walls;
}

function createCounter() {
    const counterGroup = new THREE.Group();
    const counterTopTexture = new THREE.CanvasTexture(createWoodTexture());

    // Elevated platform behind counter
    const platform = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.6, 3),
        new THREE.MeshStandardMaterial({
            map: counterTopTexture,
            roughness: 0.9,
            bumpMap: counterTopTexture,
            bumpScale: 0.03
        })
    );
    platform.position.set(0, 0.3, -2.5);
    counterGroup.add(platform);

    // Main display counter
    const displayCounter = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.1, 2),
        new THREE.MeshStandardMaterial({
            map: counterTopTexture,
            roughness: 0.7,
            metalness: 0.2,
            bumpMap: counterTopTexture,
            bumpScale: 0.02
        })
    );
    displayCounter.position.set(0, 1.4, -2.5);
    displayCounter.castShadow = true;
    displayCounter.receiveShadow = true;
    counterGroup.add(displayCounter);

    // Front counter (where the player stands)
    const frontCounter = new THREE.Mesh(
        new THREE.BoxGeometry(11, 1.2, 0.3),
        new THREE.MeshStandardMaterial({
            map: counterTopTexture,
            roughness: 0.9,
            bumpMap: counterTopTexture,
            bumpScale: 0.03
        })
    );
    frontCounter.position.set(0, 0.6, -1);
    frontCounter.castShadow = true;
    frontCounter.receiveShadow = true;
    counterGroup.add(frontCounter);

    // Counter top trim
    const trimGeometry = new THREE.BoxGeometry(11.2, 0.1, 0.4);
    const trimMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.3
    });
    
    const topTrim = new THREE.Mesh(trimGeometry, trimMaterial);
    topTrim.position.set(0, 1.2, -1);
    counterGroup.add(topTrim);

    // Display counter front panel
    const displayPanel = new THREE.Mesh(
        new THREE.BoxGeometry(11, 1.1, 0.1),
        new THREE.MeshStandardMaterial({
            map: counterTopTexture,
            roughness: 0.9,
            bumpMap: counterTopTexture,
            bumpScale: 0.03
        })
    );
    displayPanel.position.set(0, 0.85, -1.5);
    counterGroup.add(displayPanel);

    // Side panels
    const sidePanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.1, 2),
        new THREE.MeshStandardMaterial({
            map: counterTopTexture,
            roughness: 0.9,
            bumpMap: counterTopTexture,
            bumpScale: 0.03
        })
    );
    
    const leftPanel = sidePanel.clone();
    leftPanel.position.set(-5.5, 0.85, -2);
    counterGroup.add(leftPanel);

    const rightPanel = sidePanel.clone();
    rightPanel.position.set(5.5, 0.85, -2);
    counterGroup.add(rightPanel);

    // Add decorative runes on the counter front
    const runeGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    const runeMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        emissive: 0x331100,
        metalness: 0.8,
        roughness: 0.3
    });

    for (let i = 0; i < 7; i++) {
        const rune = new THREE.Mesh(runeGeometry, runeMaterial);
        rune.position.set(-4.5 + i * 1.5, 0.6, -0.85);
        rune.rotation.x = -Math.PI * 0.1;
        counterGroup.add(rune);
    }

    return counterGroup;
}

function createShelf() {
    const shelfGroup = new THREE.Group();
    const shelfTexture = new THREE.CanvasTexture(createWoodTexture());
    const bracketMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.3
    });

    // Top shelf
    const topShelf = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.2, 2),
        new THREE.MeshStandardMaterial({
            map: shelfTexture,
            roughness: 0.8,
            bumpMap: shelfTexture,
            bumpScale: 0.02
        })
    );
    topShelf.position.set(0, 4, -3.5);
    topShelf.castShadow = true;
    topShelf.receiveShadow = true;
    shelfGroup.add(topShelf);

    // Bottom shelf
    const bottomShelf = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.2, 2),
        new THREE.MeshStandardMaterial({
            map: shelfTexture,
            roughness: 0.8,
            bumpMap: shelfTexture,
            bumpScale: 0.02
        })
    );
    bottomShelf.position.set(0, 2, -3.5);
    bottomShelf.castShadow = true;
    bottomShelf.receiveShadow = true;
    shelfGroup.add(bottomShelf);

    // Brackets for both shelves
    const bracketPositions = [-5, -2.5, 0, 2.5, 5];
    bracketPositions.forEach(x => {
        // Top shelf brackets
        const topBracket = new THREE.Group();
        const topVertical = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1, 0.1),
            bracketMaterial
        );
        topVertical.position.y = 3.5;
        topBracket.add(topVertical);

        const topDiagonal = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.4, 0.1),
            bracketMaterial
        );
        topDiagonal.position.set(0, 3.7, -0.5);
        topDiagonal.rotation.x = Math.PI * 0.25;
        topBracket.add(topDiagonal);
        topBracket.position.set(x, 0, -3.5);
        shelfGroup.add(topBracket);

        // Bottom shelf brackets
        const bottomBracket = new THREE.Group();
        const bottomVertical = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1, 0.1),
            bracketMaterial
        );
        bottomVertical.position.y = 1.5;
        bottomBracket.add(bottomVertical);

        const bottomDiagonal = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.4, 0.1),
            bracketMaterial
        );
        bottomDiagonal.position.set(0, 1.7, -0.5);
        bottomDiagonal.rotation.x = Math.PI * 0.25;
        bottomBracket.add(bottomDiagonal);
        bottomBracket.position.set(x, 0, -3.5);
        shelfGroup.add(bottomBracket);
    });

    return shelfGroup;
}

// Initialize scene
scene.add(createRoom());
scene.add(createCounter());
scene.add(createShelf());
scene.add(createSign());
setupLighting();

const potionObjects = [];
const columns = 4;  // Number of chemicals per row
const potionSpacing = 2.8;  // Spacing between bottles
const startX = -4;  // Starting position for centering

// Add top row chemicals
chemicals.slice(0, 4).forEach((chemical, index) => {
    const x = startX + (index % columns) * potionSpacing;
    const bottle = createPotionBottle(chemical, new THREE.Vector3(x, 4.7, -3.5), false);
    bottle.userData.potionData = chemical;  // Store chemical data for click handling
    potionObjects.push(bottle);
    scene.add(bottle);
});

// Add bottom row chemicals
chemicals.slice(4).forEach((chemical, index) => {
    const x = startX + (index % columns) * potionSpacing;
    const bottle = createPotionBottle(chemical, new THREE.Vector3(x, 2.7, -3.5), true);
    bottle.userData.potionData = chemical;  // Store chemical data for click handling
    potionObjects.push(bottle);
    scene.add(bottle);
});

// Add spotlights for all chemicals
chemicals.forEach((chemical, index) => {
    const isTopRow = index < 4;
    const rowIndex = isTopRow ? 0 : 1;
    const colIndex = isTopRow ? index : (index - 4);
    const x = startX + colIndex * potionSpacing;
    const y = rowIndex === 0 ? 5.5 : 3.5;
    
    const spotLight = new THREE.SpotLight(chemical.color, 0.7);
    spotLight.position.set(x, y + 0.5, -2.5);
    spotLight.target.position.set(x, y - 0.8, -3.5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 1.5;
    spotLight.distance = 8;
    scene.add(spotLight);
    scene.add(spotLight.target);
});

// Add click event listener
window.addEventListener('click', onMouseClick);

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    animateFlames();
    animatePotions(potionObjects, time);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
