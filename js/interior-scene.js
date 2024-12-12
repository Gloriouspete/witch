import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0f0a);
    scene.fog = new THREE.FogExp2(0x1a0f0a, 0.01);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 4.5);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI - 0.2;
    controls.minPolarAngle = 0.2;
    controls.minDistance = 3;
    controls.maxDistance = 7;
    controls.target.set(0, 1, 0);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x3a2510, 0.3);
    scene.add(ambientLight);

    // Fireplace with warm light
    const fireplace = createFireplace();
    fireplace.position.set(4, 0, -4);
    fireplace.rotation.y = -Math.PI / 4;
    scene.add(fireplace);

    const fireplaceLight = new THREE.PointLight(0xff6600, 1.5, 10);
    fireplaceLight.position.set(4, 2, -4);
    scene.add(fireplaceLight);

    // Cauldron area light
    const cauldronLight = new THREE.PointLight(0x00ff66, 0.5, 5);
    cauldronLight.position.set(0, 1.5, 0);
    scene.add(cauldronLight);

    // Floor with wooden planks texture
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({ 
            color: 0x2a1810,
            roughness: 0.9,
            metalness: 0
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a1810,
        roughness: 0.9 
    });

    // Back wall with potion display
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 0.3),
        wallMaterial
    );
    backWall.position.set(0, 5, -5);
    scene.add(backWall);

    // Create potion display grid
    const displayGrid = new THREE.Group();
    const gridSize = 4;
    const spacing = 1.5;
    const startX = -(gridSize * spacing) / 2 + spacing / 2;
    const startY = 2;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < gridSize; col++) {
            const potionDisplay = createPotionDisplay();
            potionDisplay.position.set(
                startX + col * spacing,
                startY + row * spacing,
                -4.7
            );
            displayGrid.add(potionDisplay);
        }
    }
    scene.add(displayGrid);

    // Add wooden work table with alchemy equipment
    const workTable = createWorkTable();
    workTable.position.set(-3, 0, -2);
    workTable.rotation.y = Math.PI / 6;
    scene.add(workTable);

    // Add storage area with barrels and crates
    const storage = createStorageArea();
    storage.position.set(3, 0, -2);
    scene.add(storage);

    // Add hanging herbs and ingredients
    const herbs = createHangingHerbs();
    herbs.position.set(0, 4, -4.5);
    scene.add(herbs);

    // Side walls
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 0.3),
        wallMaterial
    );
    leftWall.position.set(-5, 5, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 0.3),
        wallMaterial
    );
    rightWall.position.set(5, 5, 0);
    rightWall.rotation.y = Math.PI / 2;
    scene.add(rightWall);

    // Front wall with door
    const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 0.3),
        wallMaterial
    );
    frontWall.position.set(0, 5, 5);
    scene.add(frontWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 0.3),
        wallMaterial
    );
    ceiling.position.set(0, 10, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Door
    const door = createDoor();
    door.position.set(0, 1.5, 4.8);
    scene.add(door);

    // Create particle system for ambient dust
    const particles = createDustParticles();
    scene.add(particles);

    // Click handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (let intersect of intersects) {
            let obj = intersect.object;
            while (obj.parent) {
                if (obj.userData.isExitDoor) {
                    window.location.href = 'index.html';
                    return;
                }
                obj = obj.parent;
            }
        }
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate fireplace light
        fireplaceLight.intensity = 1.5 + Math.sin(Date.now() * 0.005) * 0.3;
        
        // Animate dust particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.001; // Slow falling
            if (positions[i + 1] < 0) positions[i + 1] = 5; // Reset to top
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return {
        scene,
        camera,
        renderer,
        controls,
        cauldronLight
    };
}

function createPotionDisplay() {
    const display = new THREE.Group();

    // Glowing potion colors
    const potionColors = [
        0xff0088, // Bright Pink
        0x00ff88, // Bright Green
        0x0088ff, // Bright Blue
        0xff8800, // Bright Orange
        0x8800ff  // Bright Purple
    ];

    const selectedColor = potionColors[Math.floor(Math.random() * potionColors.length)];

    // Create bottle
    const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        })
    );

    // Create liquid
    const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8),
        new THREE.MeshStandardMaterial({
            color: selectedColor,
            transparent: true,
            opacity: 0.8,
            emissive: selectedColor,
            emissiveIntensity: 0.5
        })
    );
    liquid.position.y = -0.05;

    // Create cork
    const cork = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    cork.position.y = 0.25;

    // Add glow effect
    const glow = new THREE.PointLight(selectedColor, 0.5, 1);
    glow.position.y = 0.1;

    display.add(bottle, liquid, cork, glow);
    return display;
}

function createFireplace() {
    const fireplace = new THREE.Group();

    // Stone frame
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 1),
        new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    
    // Inner black part
    const inner = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    inner.position.z = 0.3;

    fireplace.add(frame, inner);
    return fireplace;
}

function createWorkTable() {
    const table = new THREE.Group();

    // Table top
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.1, 1),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    top.position.y = 0.8;

    // Table legs
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.8, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        leg.position.set(
            ((i % 2) * 2 - 1) * 0.9,
            0.4,
            (Math.floor(i / 2) * 2 - 1) * 0.4
        );
        table.add(leg);
    }

    // Add alchemy equipment
    const equipment = [
        { geometry: new THREE.CylinderGeometry(0.1, 0.15, 0.3), position: [-0.5, 0.95, 0] },
        { geometry: new THREE.SphereGeometry(0.15), position: [0, 0.95, 0.2] },
        { geometry: new THREE.ConeGeometry(0.1, 0.3), position: [0.4, 0.95, -0.2] }
    ];

    equipment.forEach(item => {
        const mesh = new THREE.Mesh(
            item.geometry,
            new THREE.MeshStandardMaterial({
                color: 0xd4d4d4,
                transparent: true,
                opacity: 0.6
            })
        );
        mesh.position.set(...item.position);
        table.add(mesh);
    });

    table.add(top);
    return table;
}

function createStorageArea() {
    const storage = new THREE.Group();

    // Create barrels
    for (let i = 0; i < 3; i++) {
        const barrel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        barrel.position.set(i * 0.7 - 0.7, 0.3, 0);
        storage.add(barrel);
    }

    // Create crates
    for (let i = 0; i < 2; i++) {
        const crate = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.6, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        crate.position.set(i * 0.7 - 0.3, 0.3, 0.7);
        storage.add(crate);
    }

    return storage;
}

function createHangingHerbs() {
    const herbs = new THREE.Group();

    // Create different types of hanging herbs
    const positions = [
        [-1.5, 0, 0], [-0.5, 0, 0], [0.5, 0, 0], [1.5, 0, 0]
    ];

    positions.forEach(pos => {
        const herb = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.15, 0.4),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        herb.position.set(...pos);
        
        const rope = new THREE.Mesh(
            new THREE.CylinderGeometry(0.01, 0.01, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        rope.position.set(pos[0], pos[1] + 0.3, pos[2]);
        
        herbs.add(herb, rope);
    });

    return herbs;
}

function createDoor() {
    const door = new THREE.Group();
    
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 3.2, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    
    const doorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.8 })
    );
    doorMesh.position.z = 0.1;
    
    const handle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshStandardMaterial({ color: 0x8b7355, metalness: 0.5 })
    );
    handle.position.set(0.6, 0, 0.2);
    
    door.add(frame, doorMesh, handle);
    door.userData.isExitDoor = true;
    
    return door;
}

function createDustParticles() {
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = Math.random() * 10 - 5;     // x
        positions[i + 1] = Math.random() * 5;      // y
        positions[i + 2] = Math.random() * 10 - 5; // z
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.3
    });
    
    return new THREE.Points(geometry, material);
}
