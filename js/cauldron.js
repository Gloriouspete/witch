import * as THREE from 'three';

export function createCauldron() {
    const cauldron = new THREE.Group();

    // Cauldron body with metallic material
    const cauldronMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1
    });

    const cauldronBody = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7),
        cauldronMaterial
    );
    cauldronBody.position.y = 1;
    cauldron.add(cauldronBody);

    // Cauldron rim
    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.1, 16, 32),
        cauldronMaterial
    );
    rim.position.y = 1.7;
    rim.rotation.x = Math.PI / 2;
    cauldron.add(rim);

    // Add legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 8);
    const legPositions = [
        [-0.7, 0.4, -0.7],
        [0.7, 0.4, -0.7],
        [0.7, 0.4, 0.7],
        [-0.7, 0.4, 0.7]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, cauldronMaterial);
        leg.position.set(...pos);
        leg.rotation.x = Math.PI * 0.05;
        leg.rotation.z = Math.atan2(pos[0], pos[2]);
        cauldron.add(leg);
    });

    // Add liquid
    const liquidGeometry = new THREE.CircleGeometry(0.9, 32);
    const liquidMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff66,
        emissive: 0x00ff66,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 1.5;
    cauldron.add(liquid);

    // Add bubbles
    const bubbleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const bubbleMaterial = new THREE.MeshStandardMaterial({
        color: 0x66ffaa,
        emissive: 0x66ffaa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });

    const bubbles = [];
    for (let i = 0; i < 10; i++) {
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.7;
        bubble.position.set(
            Math.cos(angle) * radius,
            1.5,
            Math.sin(angle) * radius
        );
        bubble.userData = {
            speed: 0.005 + Math.random() * 0.01,
            angle: angle,
            radius: radius,
            phase: Math.random() * Math.PI * 2
        };
        bubbles.push(bubble);
        cauldron.add(bubble);
    }

    cauldron.position.set(0, 0, 0);
    cauldron.userData.isCauldron = true;

    return {
        cauldron,
        liquid,
        bubbles,
        animate: (time) => {
            // Animate bubbles
            bubbles.forEach(bubble => {
                const data = bubble.userData;
                // Move up
                bubble.position.y += data.speed;
                // Add wobble
                bubble.position.x = Math.cos(data.angle + time) * data.radius;
                bubble.position.z = Math.sin(data.angle + time) * data.radius;
                // Reset if too high
                if (bubble.position.y > 2) {
                    bubble.position.y = 1.5;
                    data.angle = Math.random() * Math.PI * 2;
                    data.radius = Math.random() * 0.7;
                }
            });

            // Animate liquid glow
            liquid.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
        }
    };
}
