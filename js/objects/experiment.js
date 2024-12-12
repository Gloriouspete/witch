import * as THREE from 'three';

export function createExperimentBuilding() {
    const building = new THREE.Group();
    building.userData.isExperimentLab = true;

    // Create a dark, imposing tower with a more interesting shape
    // Main tower body with beveled edges
    const baseGeometry = new THREE.BoxGeometry(10, 20, 10);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.9,
        metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 10;
    base.castShadow = true;
    building.add(base);

    // Rest of the existing code remains unchanged
    const cornerPositions = [
        { x: -5, z: -5 }, { x: 5, z: -5 },
        { x: -5, z: 5 }, { x: 5, z: 5 }
    ];

    cornerPositions.forEach((pos, index) => {
        // Create segments for twisted effect
        const segments = 8;
        const height = 25;
        const segmentHeight = height / segments;
        const twistAmount = Math.PI / 4; // Total twist angle

        for (let i = 0; i < segments; i++) {
            const segment = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 1.8, segmentHeight, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x1a1a1a,
                    roughness: 0.8,
                    metalness: 0.4
                })
            );
            segment.position.set(pos.x, i * segmentHeight + 2, pos.z);
            segment.rotation.y = (i / segments) * twistAmount;
            building.add(segment);
        }

        // Add tower caps with glowing crystals
        const cap = new THREE.Mesh(
            new THREE.ConeGeometry(2, 4, 8),
            new THREE.MeshStandardMaterial({
                color: 0x0a0a0a,
                roughness: 0.7,
                metalness: 0.5
            })
        );
        cap.position.set(pos.x, 27, pos.z);
        building.add(cap);

        // Add floating crystal
        const crystal = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.8),
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 2,
                metalness: 1,
                roughness: 0
            })
        );
        crystal.position.set(pos.x, 29, pos.z);
        building.add(crystal);

        // Add crystal light
        const crystalLight = new THREE.PointLight(0x00ff00, 2, 10);
        crystalLight.position.set(pos.x, 29, pos.z);
        building.add(crystalLight);
    });

    // Add central spire with rotating rings
    const centralSpire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 1, 8, 8),
        new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.7,
            metalness: 0.6
        })
    );
    centralSpire.position.set(0, 24, 0);
    building.add(centralSpire);

    // Add floating rings around central spire
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(2 - i * 0.3, 0.2, 16, 32),
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 1,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        ring.position.set(0, 24 + i * 2, 0);
        ring.rotation.x = Math.PI / 2;
        building.add(ring);
    }

    // Add magical beam from central spire
    const beamGroup = new THREE.Group();
    
    // Inner beam
    const innerBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.15, 80, 8, 1, true),
        new THREE.MeshStandardMaterial({
            color: 0x8800cc,
            emissive: 0x8800cc,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })
    );
    
    // Outer beam glow
    const outerBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.3, 30, 8, 1, true),
        new THREE.MeshStandardMaterial({
            color: 0x8800cc,
            emissive: 0x8800cc,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        })
    );

    beamGroup.add(innerBeam);
    beamGroup.add(outerBeam);
    beamGroup.position.y = 39;
    building.add(beamGroup);

    // Beam particles
    const beamParticleCount = 30;
    const beamParticles = new THREE.Group();
    const beamParticlePairs = [];

    for (let i = 0; i < beamParticleCount; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0x8800cc,
                emissive: 0x8800cc,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            })
        );
        
        const particleLight = new THREE.PointLight(0x8800cc, 0.2, 1);
        beamParticles.add(particle);
        beamParticles.add(particleLight);
        beamParticlePairs.push({ particle, light: particleLight });
    }
    
    building.add(beamParticles);

    // Add decorative stone arches with glowing runes
    const archPositions = [
        { x: 0, y: 15, z: 5.1, ry: 0 },
        { x: 0, y: 15, z: -5.1, ry: Math.PI },
        { x: 5.1, y: 15, z: 0, ry: Math.PI / 2 },
        { x: -5.1, y: 15, z: 0, ry: -Math.PI / 2 }
    ];

    archPositions.forEach(pos => {
        // Stone arch
        const arch = new THREE.Mesh(
            new THREE.TorusGeometry(2, 0.4, 8, 12, Math.PI),
            new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.8,
                metalness: 0.4
            })
        );
        arch.position.set(pos.x, pos.y, pos.z);
        arch.rotation.set(Math.PI / 2, 0, pos.ry);
        building.add(arch);

        // Add glowing runes on the arch
        for (let i = 0; i < 5; i++) {
            const rune = new THREE.Mesh(
                new THREE.PlaneGeometry(0.3, 0.3),
                new THREE.MeshStandardMaterial({
                    color: 0x00ff00,
                    emissive: 0x00ff00,
                    emissiveIntensity: 2,
                    metalness: 1,
                    roughness: 0
                })
            );
            const angle = (i / 4) * Math.PI;
            const radius = 2;
            rune.position.set(
                pos.x + (pos.ry === 0 || pos.ry === Math.PI ? Math.sin(angle) * radius : 0),
                pos.y + Math.cos(angle) * radius,
                pos.z + (pos.ry === Math.PI/2 || pos.ry === -Math.PI/2 ? Math.sin(angle) * radius : 0)
            );
            rune.rotation.set(0, pos.ry, 0);
            building.add(rune);

            const runeLight = new THREE.PointLight(0x00ff00, 0.5, 2);
            runeLight.position.copy(rune.position);
            building.add(runeLight);
        }
    });

    // Add windows with magical barriers
    const windowSets = [
        // Front windows
        { x: -3, y: 8, z: 5.1 },
        { x: 3, y: 8, z: 5.1 },
        { x: -3, y: 14, z: 5.1 },
        { x: 3, y: 14, z: 5.1 },
        // Back windows
        { x: -3, y: 8, z: -5.1 },
        { x: 3, y: 8, z: -5.1 },
        { x: -3, y: 14, z: -5.1 },
        { x: 3, y: 14, z: -5.1 },
        // Side windows
        { x: 5.1, y: 11, z: -3 },
        { x: 5.1, y: 11, z: 3 },
        { x: -5.1, y: 11, z: -3 },
        { x: -5.1, y: 11, z: 3 }
    ];

    windowSets.forEach(pos => {
        // Window frame with ornate design
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2, 3, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x505050,
                roughness: 0.8,
                metalness: 0.6
            })
        );
        frame.position.set(pos.x, pos.y, pos.z);
        if (Math.abs(pos.x) > 5) frame.rotation.y = Math.PI / 2;
        building.add(frame);

        // Magical barrier effect
        const barrier = new THREE.Mesh(
            new THREE.PlaneGeometry(1.8, 2.8),
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 1,
                metalness: 1,
                roughness: 0,
                transparent: true,
                opacity: 0.4
            })
        );
        if (Math.abs(pos.x) > 5) {
            barrier.position.set(pos.x - 0.1, pos.y, pos.z);
            barrier.rotation.y = Math.PI / 2;
        } else {
            barrier.position.set(pos.x, pos.y, pos.z - 0.1);
        }
        building.add(barrier);

        // Add pulsing light
        const light = new THREE.PointLight(0x00ff00, 1.5, 5);
        if (Math.abs(pos.x) > 5) {
            light.position.set(pos.x - 1, pos.y, pos.z);
        } else {
            light.position.set(pos.x, pos.y, pos.z - 1);
        }
        building.add(light);
    });

    // Add mystical chains with glowing shackles
    const chainPositions = [
        { x: -4.9, y: 12, z: 0 },
        { x: 4.9, y: 10, z: 2 },
        { x: -4.9, y: 8, z: -2 },
        { x: 4.9, y: 14, z: -1 },
        { x: -4.9, y: 16, z: 1 }
    ];

    chainPositions.forEach(pos => {
        const chain = new THREE.Group();
        const numLinks = 8;
        for (let i = 0; i < numLinks; i++) {
            const link = new THREE.Mesh(
                new THREE.TorusGeometry(0.2, 0.05, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x505050,
                    roughness: 0.7,
                    metalness: 0.8
                })
            );
            link.position.y = -i * 0.3;
            link.rotation.x = Math.PI / 2;
            chain.add(link);
        }

        // Add glowing shackle
        const shackle = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, 0.08, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 1,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        shackle.position.y = -numLinks * 0.3;
        shackle.rotation.x = Math.PI / 2;
        chain.add(shackle);

        // Add shackle light
        const shackleLight = new THREE.PointLight(0x00ff00, 0.5, 2);
        shackleLight.position.copy(shackle.position);
        chain.add(shackleLight);

        chain.position.set(pos.x, pos.y, pos.z);
        building.add(chain);
    });

    // Add imposing entrance
    const doorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(4, 6, 1),
        new THREE.MeshStandardMaterial({
            color: 0x505050,
            metalness: 0.8,
            roughness: 0.2
        })
    );
    doorFrame.position.set(0, 3, 5);
    building.add(doorFrame);

    // Add ornate door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 5.5, 0.5),
        new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        })
    );
    door.position.set(0, 3, 5.2);
    building.add(door);

    // Add mystical runes on the door
    const runePositions = [
        { x: -1, y: 4 }, { x: 1, y: 4 },
        { x: -1, y: 2 }, { x: 1, y: 2 },
        { x: 0, y: 3 }  // Center rune
    ];

    runePositions.forEach(pos => {
        const rune = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 2,
                metalness: 1,
                roughness: 0,
                transparent: true,
                opacity: 0.8
            })
        );
        rune.position.set(pos.x, pos.y, 5.5);
        building.add(rune);

        const runeLight = new THREE.PointLight(0x00ff00, 0.5, 1);
        runeLight.position.set(pos.x, pos.y, 5.4);
        building.add(runeLight);
    });

    // Add gargoyles with glowing eyes
    const gargoylePositions = [
        { x: -5, y: 18, z: -5, ry: Math.PI / 4 },
        { x: 5, y: 18, z: -5, ry: -Math.PI / 4 },
        { x: -5, y: 18, z: 5, ry: 3 * Math.PI / 4 },
        { x: 5, y: 18, z: 5, ry: -3 * Math.PI / 4 }
    ];

    gargoylePositions.forEach(pos => {
        const gargoyle = new THREE.Group();

        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1, 2),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 0.9,
                metalness: 0.3
            })
        );
        gargoyle.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 1),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 0.9,
                metalness: 0.3
            })
        );
        head.position.set(0, 0.2, 1);
        gargoyle.add(head);

        // Wings
        const wingGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 0,    // base
            1.5, 0.5, -0.5,   // tip
            1.5, -0.5, -0.5,  // bottom
        ]);
        wingGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const wing = new THREE.Mesh(
            wingGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 0.9,
                metalness: 0.3,
                side: THREE.DoubleSide
            })
        );
        
        const leftWing = wing.clone();
        leftWing.position.set(-0.75, 0, 0);
        gargoyle.add(leftWing);

        const rightWing = wing.clone();
        rightWing.position.set(0.75, 0, 0);
        rightWing.scale.x = -1;
        gargoyle.add(rightWing);

        // Add glowing eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 2,
            metalness: 1,
            roughness: 0
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 0.2, 1.4);
        gargoyle.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 0.2, 1.4);
        gargoyle.add(rightEye);

        // Add eye lights
        const leftEyeLight = new THREE.PointLight(0xff0000, 0.5, 2);
        leftEyeLight.position.copy(leftEye.position);
        gargoyle.add(leftEyeLight);

        const rightEyeLight = new THREE.PointLight(0xff0000, 0.5, 2);
        rightEyeLight.position.copy(rightEye.position);
        gargoyle.add(rightEyeLight);

        gargoyle.position.set(pos.x, pos.y, pos.z);
        gargoyle.rotation.y = pos.ry;
        building.add(gargoyle);
    });

    // Animate beam particles
    const animate = () => {
        beamParticlePairs.forEach((pair, index) => {
            const time = Date.now() * 0.001;
            const yPos = 24 + (index / beamParticlePairs.length) * 30;
            const angle = time * 2 + (index / beamParticlePairs.length) * Math.PI * 2;
            const radius = 0.2 * Math.sin(time * 3 + index);
            
            pair.particle.position.set(
                Math.cos(angle) * radius,
                yPos + Math.sin(time * 2 + index) * 0.3,
                Math.sin(angle) * radius
            );
            pair.light.position.copy(pair.particle.position);
            pair.particle.scale.setScalar(0.5 + Math.sin(time * 4 + index) * 0.2);
        });
        
        requestAnimationFrame(animate);
    };
    animate();

    return building;
}
