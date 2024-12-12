import * as THREE from 'three';

export function createPriceTag(text, position) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128; // Reduced canvas size
    canvas.height = 64;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simplified text rendering
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(text, canvas.width/2, canvas.height/2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter; // Optimize texture filtering
    texture.magFilter = THREE.NearestFilter;
    
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
    });
    
    const tag = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.4),
        material
    );
    tag.position.copy(position);
    return tag;
}

// Simplified bubble creation with fewer particles
function createBubbles(color) {
    const bubbleCount = 3; // Reduced number of bubbles
    const bubbleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(bubbleCount * 3);
    const speeds = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 1] = Math.random() * 0.3 - 0.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        speeds[i] = 0.002 + Math.random() * 0.003;
    }

    bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const bubbleMaterial = new THREE.PointsMaterial({
        color: color,
        size: 0.02,
        transparent: true,
        opacity: 0.6
    });

    const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
    bubbles.userData = { speeds };
    return bubbles;
}

// Reusable materials
const glassMaterial = new THREE.MeshPhongMaterial({ // Simplified from MeshPhysicalMaterial
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    shininess: 100
});

export function createPotionBottle(potion, position, isAlternateStyle = false) {
    const group = new THREE.Group();

    // Create bottle mesh
    const bottleGeometry = isAlternateStyle ? 
        new THREE.CylinderGeometry(0.2, 0.2, 0.5, 6) :
        new THREE.CylinderGeometry(0.15, 0.2, 0.6, 8);
    
    const bottle = new THREE.Mesh(bottleGeometry, glassMaterial);
    bottle.castShadow = true;
    group.add(bottle);

    // Create liquid
    const liquidGeometry = isAlternateStyle ?
        new THREE.CylinderGeometry(0.18, 0.18, 0.3, 6) :
        new THREE.CylinderGeometry(0.14, 0.19, 0.4, 8);
    
    const liquidMaterial = new THREE.MeshPhongMaterial({ // Simplified material
        color: potion.color,
        transparent: true,
        opacity: 0.9,
        emissive: potion.color,
        emissiveIntensity: 0.2
    });
    
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = isAlternateStyle ? -0.05 : -0.1;
    liquid.userData = { baseY: liquid.position.y };
    group.add(liquid);

    // Add bubbles with reduced count
    const bubbles = createBubbles(potion.color);
    bubbles.position.y = isAlternateStyle ? -0.15 : -0.2;
    group.add(bubbles);

    // Add price tag
    const priceTag = createPriceTag(potion.price, new THREE.Vector3(0, -0.5, 0.3));
    group.add(priceTag);

    group.position.copy(position);
    return group;
}

// Optimized animation function
export function animatePotions(potionObjects, time) {
    if (!Array.isArray(potionObjects)) return;

    potionObjects.forEach(bottle => {
        if (!bottle || !bottle.children || bottle.children.length < 3) return;

        // Animate liquid with reduced frequency
        const liquid = bottle.children[1];
        if (liquid && liquid.userData && liquid.material) {
            const offset = Math.sin(time * 1.5) * 0.01; // Reduced movement
            liquid.position.y = liquid.userData.baseY + offset;
        }

        // Animate bubbles with reduced updates
        const bubbles = bottle.children[2];
        if (!bubbles || !bubbles.geometry || !bubbles.geometry.attributes.position) return;

        const positions = bubbles.geometry.attributes.position.array;
        const speeds = bubbles.userData?.speeds;
        if (!positions || !speeds) return;

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
    });
}
