import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createWitch } from './objects/witch.js';
import { combatSystem } from './combat-system.js';

let scene, camera, renderer, controls, witch;

// Expose THREE, camera, and witch to window for other modules
window.THREE = THREE;
window.camera = null;
window.witch = null;

function createLights() {
    const lights = [];

    // Add ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
    lights.push(ambientLight);

    // Add directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0x664422, 0.3);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    lights.push(directionalLight);

    // Add point light for atmosphere
    const atmosphereLight = new THREE.PointLight(0x9966ff, 0.8, 20);
    atmosphereLight.position.set(0, 5, 0);
    atmosphereLight.castShadow = true;
    lights.push(atmosphereLight);

    return lights;
}

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0f1f); // Dark purple for dungeon atmosphere

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 12);
    window.camera = camera; // Update global camera reference

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;

    // Create lights
    const lights = createLights();
    lights.forEach(light => scene.add(light));

    // Add ambient fog for atmosphere
    scene.fog = new THREE.FogExp2(0x1a0f1f, 0.04);

    // Create dungeon room
    createDungeonRoom();

    // Create witch at center of room
    witch = createWitch();
    witch.position.set(0, 0, 0); // Centered position
    scene.add(witch);
    window.witch = witch; // Update global witch reference

    // Setup UI handlers
    setupUIHandlers();

    // Start animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function setupUIHandlers() {
    // Setup challenge button
    const challengeButton = document.querySelector('.challenge-button');
    challengeButton.addEventListener('click', () => {
        document.getElementById('combat-ui').style.display = 'block';
    });
    
    // Setup combat UI buttons
    const combatUI = document.getElementById('combat-ui');
    const confirmButton = document.getElementById('confirm-fight');
    const cancelButton = document.getElementById('cancel-fight');

    confirmButton.addEventListener('click', async () => {
        combatUI.style.display = 'none';
        const startFight = await combatSystem.initialize();
        if (startFight) {
            document.querySelector('.health-bars').style.display = 'block';
            document.querySelector('.challenge-button').style.display = 'none';
        }
    });

    cancelButton.addEventListener('click', () => {
        combatUI.style.display = 'none';
    });
}

function createStonePattern(color, roughness, metalness) {
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: metalness,
        bumpScale: 1
    });

    // Create a canvas for the stone pattern
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#2a1f2d';
    ctx.fillRect(0, 0, 256, 256);

    // Add stone pattern
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const size = 20 + Math.random() * 40;
        
        ctx.fillStyle = `rgba(20, 15, 25, ${0.3 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    
    material.map = texture;
    return material;
}

function createDungeonRoom() {
    const stoneMaterial = createStonePattern(0x2a1f2d, 0.9, 0.1);

    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        stoneMaterial
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        stoneMaterial
    );
    backWall.position.z = -10;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        stoneMaterial
    );
    leftWall.position.x = -10;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        stoneMaterial
    );
    rightWall.position.x = 10;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Front wall (solid)
    const frontWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        stoneMaterial
    );
    frontWall.position.z = 10;
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Add ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        stoneMaterial
    );
    ceiling.position.y = 10;
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Add chains hanging from ceiling
    const chainPositions = [
        { x: -6, z: -6 }, { x: 6, z: -6 },
        { x: -6, z: 6 }, { x: 6, z: 6 },
        { x: -3, z: -3 }, { x: 3, z: -3 },
        { x: -3, z: 3 }, { x: 3, z: 3 }
    ];

    chainPositions.forEach(pos => {
        const chain = createChain();
        chain.position.set(pos.x, 10, pos.z);
        scene.add(chain);
    });

    // Add torches
    const torchPositions = [
        { x: -8, y: 4, z: -9 },
        { x: 8, y: 4, z: -9 },
        { x: -9, y: 4, z: -5 },
        { x: 9, y: 4, z: -5 },
        { x: -9, y: 4, z: 5 },
        { x: 9, y: 4, z: 5 },
        // Front wall torches
        { x: -8, y: 4, z: 9 },
        { x: 8, y: 4, z: 9 }
    ];

    torchPositions.forEach(pos => {
        // Torch holder
        const holder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0x4a4a4a,
                roughness: 0.8,
                metalness: 0.5
            })
        );
        holder.position.set(pos.x, pos.y, pos.z);
        holder.rotation.x = Math.PI / 2;
        holder.castShadow = true;
        scene.add(holder);

        // Flame light
        const torchLight = new THREE.PointLight(0xff6600, 1.5, 8);
        torchLight.position.set(pos.x, pos.y - 0.2, pos.z + 0.5);
        torchLight.castShadow = true;
        scene.add(torchLight);

        // Animate torch light
        const initialIntensity = torchLight.intensity;
        setInterval(() => {
            torchLight.intensity = initialIntensity * (0.8 + Math.random() * 0.4);
        }, 100);
    });

    // Add magical runes on the floor
    const runeGeometry = new THREE.CircleGeometry(0.3, 6);
    const runeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 5;
        const rune = new THREE.Mesh(runeGeometry, runeMaterial);
        rune.position.set(
            Math.cos(angle) * radius,
            0.01,
            Math.sin(angle) * radius
        );
        rune.rotation.x = -Math.PI / 2;
        scene.add(rune);

        const runeLight = new THREE.PointLight(0x00ff00, 0.5, 3);
        runeLight.position.copy(rune.position);
        runeLight.position.y = 0.1;
        scene.add(runeLight);
    }
}

function createChain() {
    const chain = new THREE.Group();
    const linkCount = 10 + Math.floor(Math.random() * 5);
    const linkLength = 0.3;
    const linkRadius = 0.05;

    const linkMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.7,
        metalness: 0.8
    });

    for (let i = 0; i < linkCount; i++) {
        const linkGeometry = new THREE.TorusGeometry(linkRadius * 2, linkRadius, 8, 16);
        const link = new THREE.Mesh(linkGeometry, linkMaterial);
        link.position.y = -i * linkLength;
        link.rotation.x = (i % 2) * Math.PI / 2; // Alternate link orientation
        link.castShadow = true;
        chain.add(link);
    }

    // Add shackle at the end
    const shackleGeometry = new THREE.TorusGeometry(linkRadius * 4, linkRadius * 1.5, 8, 16);
    const shackle = new THREE.Mesh(shackleGeometry, linkMaterial);
    shackle.position.y = -linkCount * linkLength;
    shackle.castShadow = true;
    chain.add(shackle);

    return chain;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Add some gentle floating movement to the witch
    if (witch) {
        witch.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        witch.rotation.y += 0.005;
    }

    // Animate chains
    scene.children.forEach(child => {
        if (child.isGroup) {
            child.children.forEach((link, i) => {
                if (link.isMesh) {
                    link.rotation.z = Math.sin(Date.now() * 0.001 + i * 0.2) * 0.1;
                }
            });
        }
    });

    renderer.render(scene, camera);
}

// Initialize the scene
init();
