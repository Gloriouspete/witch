import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initializeInventory } from './inventory-system.js';

try {
    // Initialize inventory system
    initializeInventory();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0f0a);
    scene.fog = new THREE.FogExp2(0x1a0f0a, 0.015);

    // Rest of the file remains unchanged...
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 311;
    controls.maxDistance = 115;

    // Room setup
    const walls = new THREE.Group();
    
    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(12, 8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    backWall.position.set(0, 4, -4);
    walls.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    leftWall.position.set(-6, 4, 0);
    walls.add(leftWall);

    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    rightWall.position.set(6, 4, 0);
    walls.add(rightWall);

    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x3a2510,
            roughness: 0.8,
            metalness: 0.2
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    walls.add(floor);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(12, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    ceiling.position.set(0, 8, 0);
    walls.add(ceiling);

    scene.add(walls);

    // Counter
    const counter = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1, 1),
        new THREE.MeshStandardMaterial({
            color: 0x3a2510,
            roughness: 0.8
        })
    );
    counter.position.set(0, 0.5, 0);
    scene.add(counter);

    // Shelf
    const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.2, 3),
        new THREE.MeshStandardMaterial({
            color: 0x3a2510,
            roughness: 0.8
        })
    );
    shelf.position.set(0, 2, -2);
    scene.add(shelf);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xff9933, 1.5, 20);
    mainLight.position.set(0, 7, 0);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const sconcePositions = [
        { x: -5, y: 4, z: -3 },
        { x: 5, y: 4, z: -3 },
        { x: -5, y: 4, z: 1 },
        { x: 5, y: 4, z: 1 }
    ];

    sconcePositions.forEach(pos => {
        const sconceLight = new THREE.PointLight(0xff6633, 0.8, 8);
        sconceLight.position.set(pos.x, pos.y, pos.z);
        scene.add(sconceLight);

        const flameMaterial = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='),
            color: 0xff6633,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        const flame = new THREE.Sprite(flameMaterial);
        flame.position.copy(sconceLight.position);
        flame.scale.set(0.5, 0.8, 0.5);
        scene.add(flame);
    });

    // Shop Sign
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 72px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.strokeStyle = '#2a1810';
    ctx.lineWidth = 8;
    ctx.strokeText('Mystic Chemicals', canvas.width/2, canvas.height/2);
    
    ctx.fillStyle = '#ffd700';
    ctx.fillText('Mystic Chemicals', canvas.width/2, canvas.height/2);

    const signTexture = new THREE.CanvasTexture(canvas);
    const signMaterial = new THREE.MeshStandardMaterial({
        map: signTexture,
        metalness: 0.3,
        roughness: 0.7
    });

    const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(5, 1.5, 0.3),
        signMaterial
    );
    signBoard.position.set(0, 6.5, -3.8);
    scene.add(signBoard);

    // Updated Potions with fewer bottles and mystical colors
    const potions = [
        { 
            color: 0x000000,  // Pure black liquid
            name: 'Void Essence', 
            price: '666g', 
            glow: 0.3,
            bottleColor: 0x1a0f0a,  // Dark bottle
            type: 'dark',
            liquidMetalness: 0.8,
            liquidOpacity: 0.95,
            transmission: 0.1
        },
        { 
            color: 0xffd700,  // Pure gold liquid
            name: 'Golden Elixir', 
            price: '500g', 
            glow: 0.0,
            bottleColor: 0x000000,  // Black bottle
            type: 'gold',
            liquidMetalness: 1.0,
            liquidOpacity: 1.0
        },
        { 
            color: 0xff0000,  // Pure red liquid
            name: 'Dragon Blood', 
            price: '450g', 
            glow: 0.4,
            bottleColor: 0x000000,
            type: 'dark',
            liquidMetalness: 0.3,
            liquidOpacity: 0.9,
            transmission: 0.2
        },
        { 
            color: 0xdc143c,  // Deep crimson
            name: 'Blood Moon', 
            price: '500g', 
            glow: 0.5,
            bottleColor: 0x1a0f0a,
            type: 'dark',
            liquidMetalness: 0.4,
            liquidOpacity: 0.95,
            transmission: 0.3
        },
        { 
            color: 0x4b0082,  // Indigo
            name: 'Night Vision', 
            price: '400g', 
            glow: 0.6,
            bottleColor: 0x000000,
            type: 'dark',
            liquidMetalness: 0.5,
            liquidOpacity: 0.9,
            transmission: 0.2
        },
        { 
            color: 0x8b0000,  // Dark red
            name: 'Dragon Blood', 
            price: '550g', 
            glow: 0.4,
            bottleColor: 0x1a0f0a,
            type: 'dark',
            liquidMetalness: 0.6,
            liquidOpacity: 0.95,
            transmission: 0.15
        },
        { 
            color: 0x4a0404,  // Deep burgundy
            name: 'Ancient Power', 
            price: '600g', 
            glow: 0.5,
            bottleColor: 0x000000,
            type: 'dark',
            liquidMetalness: 0.7,
            liquidOpacity: 0.9,
            transmission: 0.1
        }
    ];

    function createPriceTag(text, position) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;

        ctx.fillStyle = '#d4b483';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, canvas.width-8, canvas.height-8);

        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#800000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        const tag = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.4),
            material
        );
        tag.position.copy(position);
        return tag;
    }

    function createBubbles(color, glow = 0.2) {
        const bubbleCount = 5;
        const bubbleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(bubbleCount * 3);
        const speeds = [];

        for (let i = 0; i < bubbleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 1] = Math.random() * 0.3 - 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
            speeds.push(0.002 + Math.random() * 0.003);
        }

        bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const bubbleMaterial = new THREE.PointsMaterial({
            color: color,
            size: 0.02,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
        bubbles.userData = { speeds };
        return bubbles;
    }

    function createPotionBottle(potion, position) {
        const group = new THREE.Group();

        // Create bottle
        const bottleGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.6, 16, 1, true);
        let glassMaterial;
        
        if (potion.type === 'dark') {
            glassMaterial = new THREE.MeshPhysicalMaterial({
                color: potion.bottleColor,
                metalness: 0.3,
                roughness: 0.1,
                transmission: 0.1,
                thickness: 0.05,
                transparent: true,
                opacity: 0.95
            });
        } else {
            glassMaterial = new THREE.MeshPhysicalMaterial({
                color: potion.bottleColor,
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.9,
                thickness: 0.05,
                transparent: true,
                opacity: 0.8
            });
        }

        const bottle = new THREE.Mesh(bottleGeometry, glassMaterial);
        bottle.castShadow = true;
        group.add(bottle);

        const bottomGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
        bottom.position.y = -0.3;
        group.add(bottom);

        // Create liquid with extreme properties
        const liquidGeometry = new THREE.CylinderGeometry(0.14, 0.19, 0.4, 16);
        const liquidMaterial = new THREE.MeshPhysicalMaterial({
            color: potion.color,
            metalness: potion.liquidMetalness || 0.0,
            roughness: 0.2,
            transmission: potion.transmission !== undefined ? potion.transmission : 0.6,
            thickness: 0.1,
            transparent: true,
            opacity: potion.liquidOpacity || 1.0,
            emissive: potion.color,
            emissiveIntensity: potion.glow || 0
        });
        const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
        liquid.position.y = -0.1;
        liquid.userData = { baseY: -0.1 };
        group.add(liquid);

        // Create cork
        const corkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);
        const corkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.1
        });
        const cork = new THREE.Mesh(corkGeometry, corkMaterial);
        cork.position.y = 0.35;
        group.add(cork);

        const bubbles = createBubbles(potion.color, potion.glow);
        bubbles.position.y = -0.1;
        group.add(bubbles);

        const priceTag = createPriceTag(`${potion.price}`, new THREE.Vector3(0, -0.5, 0.3));
        group.add(priceTag);

        group.position.copy(position);
        return group;
    }

    const potionObjects = [];
    const potionSpacing = 3.0;  // Increased spacing for fewer bottles
    const startX = -4.5;  // Adjusted starting position for fewer bottles
    potions.forEach((potion, index) => {
        const x = startX + (index * potionSpacing);
        const bottle = createPotionBottle(potion, new THREE.Vector3(x, 2.4, -2));
        potionObjects.push(bottle);
        scene.add(bottle);
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        scene.children.forEach(child => {
            if (child.type === 'Sprite') {
                child.scale.x = 0.2 + Math.sin(Date.now() * 0.01) * 0.02;
                child.scale.y = 0.4 + Math.sin(Date.now() * 0.01) * 0.04;
            }
        });

        potionObjects.forEach((bottle, index) => {
            if (bottle.children[2]) {  // Check if liquid exists
                const liquid = bottle.children[2];
                if (liquid.userData && liquid.userData.baseY !== undefined) {
                    const offset = Math.sin(time * 2 + index) * 0.02;
                    liquid.position.y = liquid.userData.baseY + offset;
                }
            }
            
            if (bottle.children[4]) {  // Check if bubbles exist
                const bubbles = bottle.children[4];
                if (bubbles.geometry && bubbles.geometry.attributes.position) {
                    const positions = bubbles.geometry.attributes.position.array;
                    const speeds = bubbles.userData?.speeds || [];
                    
                    for (let i = 0; i < speeds.length; i++) {
                        const baseIndex = i * 3;
                        positions[baseIndex + 1] += speeds[i];
                        
                        if (positions[baseIndex + 1] > 0.1) {
                            positions[baseIndex + 1] = -0.2;
                            positions[baseIndex] = (Math.random() - 0.5) * 0.2;
                            positions[baseIndex + 2] = (Math.random() - 0.5) * 0.2;
                        }
                    }
                    
                    bubbles.geometry.attributes.position.needsUpdate = true;
                }
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

} catch (error) {
    document.getElementById('error').textContent = error.toString();
    console.error(error);
}
