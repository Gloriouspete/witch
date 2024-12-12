import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPotionBottle, animatePotions } from './potions.js';
import { setupLighting } from './scene-lighting.js';
import { createWoodTexture } from './wood-texture.js';
import { createSign } from './sign.js';
import { initializePurchaseInteractions, handlePotionClick } from './purchase-interaction.js';
import { initializeInventory } from './inventory-system.js';

// Initialize inventory system
initializeInventory();

// Scene setup
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a0f0a);
scene.fog = new THREE.FogExp2(0x1a0f0a, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7, 8);
camera.lookAt(30, -3.4, -92);

const renderer = new THREE.WebGLRenderer({ 
    antialias: false, // Disable antialiasing for better performance
    powerPreference: "high-performance" 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap; // Use basic shadows for better performance
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
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(potionObjects, true);

    if (intersects.length > 0) {
        let potionObject = intersects[0].object;
        while (potionObject.parent && !potionObject.userData.potionData) {
            potionObject = potionObject.parent;
        }

        if (potionObject.userData.potionData) {
            handlePotionClick(potionObject.userData.potionData, potionObject);
        }
    }
}

// Room creation functions remain the same...
function createRoom() {
    const walls = new THREE.Group();
    const woodTexture = new THREE.CanvasTexture(createWoodTexture());
    
    // Optimize materials by reusing them
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        map: woodTexture,
        roughness: 0.9,
        bumpMap: woodTexture,
        bumpScale: 0.02
    });

    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(12, 8, 0.3),
        wallMaterial
    );
    backWall.position.set(0, 4, -4);
    backWall.receiveShadow = true;
    walls.add(backWall);

    const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(12, 8, 0.3),
        wallMaterial
    );
    frontWall.position.set(0, 4, 12);
    frontWall.receiveShadow = true;
    walls.add(frontWall);

    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 8, 16),
        wallMaterial
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
        wallMaterial
    );
    ceiling.position.set(0, 8, 4);
    ceiling.receiveShadow = true;
    walls.add(ceiling);

    return walls;
}

// Counter and shelf functions remain the same...
function createCounter() {
    const counterGroup = new THREE.Group();
    const counterTopTexture = new THREE.CanvasTexture(createWoodTexture());

    // Reuse materials
    const woodMaterial = new THREE.MeshStandardMaterial({
        map: counterTopTexture,
        roughness: 0.9,
        bumpMap: counterTopTexture,
        bumpScale: 0.03
    });

    const platform = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.6, 3),
        woodMaterial
    );
    platform.position.set(0, 0.3, -2.5);
    counterGroup.add(platform);

    const displayCounter = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.1, 2),
        woodMaterial
    );
    displayCounter.position.set(0, 1.4, -2.5);
    displayCounter.castShadow = true;
    displayCounter.receiveShadow = true;
    counterGroup.add(displayCounter);

    const frontCounter = new THREE.Mesh(
        new THREE.BoxGeometry(11, 1.2, 0.3),
        woodMaterial
    );
    frontCounter.position.set(0, 0.6, -1);
    frontCounter.castShadow = true;
    frontCounter.receiveShadow = true;
    counterGroup.add(frontCounter);

    return counterGroup;
}

function createShelf() {
    const shelfGroup = new THREE.Group();
    const shelfTexture = new THREE.CanvasTexture(createWoodTexture());
    
    // Reuse materials
    const shelfMaterial = new THREE.MeshStandardMaterial({
        map: shelfTexture,
        roughness: 0.8,
        bumpMap: shelfTexture,
        bumpScale: 0.02
    });

    const topShelf = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.2, 2),
        shelfMaterial
    );
    topShelf.position.set(0, 4, -3.5);
    topShelf.castShadow = true;
    topShelf.receiveShadow = true;
    shelfGroup.add(topShelf);

    const bottomShelf = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.2, 2),
        shelfMaterial
    );
    bottomShelf.position.set(0, 2, -3.5);
    bottomShelf.castShadow = true;
    bottomShelf.receiveShadow = true;
    shelfGroup.add(bottomShelf);

    return shelfGroup;
}

// Initialize scene
scene.add(createRoom());
scene.add(createCounter());
scene.add(createShelf());
scene.add(createSign());
setupLighting();

// Setup potions with more varieties
const topPotions = [
    { color: 0xff0000, name: 'Sulfuric Acid', price: '$30', glow: 0.4 },
    { color: 0x0000ff, name: 'Hydrochloric Acid', price: '$50', glow: 0.5 },
    { color: 0xffff00, name: 'Chlorine', price: '$100', glow: 0.6 },
    { color: 0xff8800, name: 'Phosphorus', price: '$90', glow: 0.4 }
];

const bottomPotions = [
    { color: 0xff1493, name: 'Arsenic', price: '$45', glow: 0.5 },
    { color: 0x9400d3, name: 'Cyanide', price: '$75', glow: 0.6 },
    { color: 0x00bfff, name: 'Sodium Hydroxide', price: '$85', glow: 0.5 },
    { color: 0xffd700, name: 'Nitrous Oxide', price: '$120', glow: 0.7 }
];

const potionObjects = [];
const columns = 4;
const potionSpacing = 2.8;
const startX = -4;

// Add potions
[...topPotions, ...bottomPotions].forEach((potion, index) => {
    const isTopRow = index < topPotions.length;
    const x = startX + (index % columns) * potionSpacing;
    const y = isTopRow ? 4.7 : 2.7;
    const bottle = createPotionBottle(potion, new THREE.Vector3(x, y, -3.5), !isTopRow);
    bottle.userData.potionData = potion;
    potionObjects.push(bottle);
    scene.add(bottle);
});

// Add ambient lighting instead of individual spotlights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Single directional light for all potions
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512; // Reduced shadow map size
directionalLight.shadow.mapSize.height = 512;
scene.add(directionalLight);

// Add click event listener
window.addEventListener('click', onMouseClick);

// Animation loop with frame limiting
let lastTime = 0;
const frameInterval = 1000 / 30; // Limit to 30 FPS

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Skip frame if too soon
    if (currentTime - lastTime < frameInterval) return;
    
    lastTime = currentTime;
    const time = currentTime * 0.001;

    // Only animate visible potions
    const visiblePotions = potionObjects.filter(potion => {
        const screenPosition = potion.position.clone().project(camera);
        return screenPosition.z < 1;
    });
    
    animatePotions(visiblePotions, time);
    controls.update();
    renderer.render(scene, camera);
}

// Optimize resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 250);
});

animate(0);
