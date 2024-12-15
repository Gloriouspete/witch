import * as THREE from 'three';

// export function createVillageHouse() {
//     // Village house code remains unchanged
//     const house = new THREE.Group();
    
//     // Base
//     const base = new THREE.Mesh(
//         new THREE.BoxGeometry(4, 0.5, 4),
//         new THREE.MeshStandardMaterial({ color: 0x4a3b22, roughness: 0.9 })
//     );
//     base.position.y = 0.25;
//     base.castShadow = true;
//     house.add(base);

//     // Main structure
//     const mainBody = new THREE.Mesh(
//         new THREE.BoxGeometry(3.8, 3, 3.8),
//         new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 })
//     );
//     mainBody.position.y = 2;
//     mainBody.castShadow = true;
//     house.add(mainBody);

//     // Roof
//     const roof = new THREE.Mesh(
//         new THREE.ConeGeometry(3, 2, 4),
//         new THREE.MeshStandardMaterial({ color: 0x4a3b22, roughness: 0.7 })
//     );
//     roof.position.y = 4.5;
//     roof.rotation.y = Math.PI / 4;
//     roof.castShadow = true;
//     house.add(roof);

//     // Window
//     const window = new THREE.Mesh(
//         new THREE.PlaneGeometry(0.8, 0.8),
//         new THREE.MeshBasicMaterial({
//             color: 0xffcc77,
//             transparent: true,
//             opacity: 0.5
//         })
//     );
//     window.position.set(0, 2.5, 1.91);
//     house.add(window);

//     // Door
//     const door = new THREE.Mesh(
//         new THREE.BoxGeometry(1, 2, 0.1),
//         new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.9 })
//     );
//     door.position.set(0, 1.25, 1.91);
//     house.add(door);

//     return house;
// }

export function createVillageHouse() {
    // Village house code optimized
    const house = new THREE.Group();
    
    // Base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.5, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a3b22, roughness: 0.9 })
    );
    base.position.y = 0.25;
    house.add(base);

    // Main structure
    const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 3, 3.8),
        new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 })
    );
    mainBody.position.y = 2;
    house.add(mainBody);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3, 2, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a3b22, roughness: 0.7 })
    );
    roof.position.y = 4.5;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    // Window (simplified)
    const window = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.8),
        new THREE.MeshBasicMaterial({
            color: 0xffcc77,
            transparent: true,
            opacity: 0.5
        })
    );
    window.position.set(0, 2.5, 1.91);
    house.add(window);

    // Door (simplified)
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.9 })
    );
    door.position.set(0, 1.25, 1.91);
    house.add(door);

    // Avoid setting shadows for all objects in the house
    base.castShadow = false;
    mainBody.castShadow = false;
    roof.castShadow = false;
    window.castShadow = false;
    door.castShadow = false;

    return house;
}




export function createWitchHouse() {
    const house = new THREE.Group();
    
    // Enhanced stone base with magical runes
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x2a1810,
            roughness: 0.9,
            metalness: 0.2,
            emissive: 0x1a0f0a,
            emissiveIntensity: 0.2
        })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    house.add(base);

    // Add glowing runes around the base
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const rune = new THREE.Mesh(
            new THREE.PlaneGeometry(0.4, 0.4),
            new THREE.MeshStandardMaterial({
                color: 0xff6600,
                emissive: 0xff6600,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            })
        );
        rune.position.set(
            Math.cos(angle) * 3.8,
            0.6,
            Math.sin(angle) * 3.8
        );
        rune.rotation.x = -Math.PI / 2;
        house.add(rune);

        const runeLight = new THREE.PointLight(0xff6600, 0.5, 2);
        runeLight.position.copy(rune.position);
        runeLight.position.y += 0.1;
        house.add(runeLight);
    }

    // Main structure with detailed woodwork
    const mainBody = new THREE.Group();
    
    // Core structure
    const core = new THREE.Mesh(
        new THREE.BoxGeometry(7, 8, 7),
        new THREE.MeshStandardMaterial({ 
            color: 0x3a2510,
            roughness: 0.8,
            metalness: 0.1,
            emissive: 0x1a0f0a,
            emissiveIntensity: 0.1
        })
    );
    mainBody.add(core);

    // Add wooden beams for detail
    const beamPositions = [
        { x: -3.5, y: 0, z: 0 }, { x: 3.5, y: 0, z: 0 },
        { x: 0, y: 0, z: -3.5 }, { x: 0, y: 0, z: 3.5 }
    ];

    beamPositions.forEach(pos => {
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 8, 0.4),
            new THREE.MeshStandardMaterial({
                color: 0x2a1810,
                roughness: 0.9,
                metalness: 0.1
            })
        );
        beam.position.set(pos.x, pos.y, pos.z);
        mainBody.add(beam);
    });

    mainBody.position.y = 4.5;
    mainBody.rotation.y = Math.PI * 0.02;
    house.add(mainBody);

    // Enhanced roof with magical elements
    const roofGroup = new THREE.Group();
    
    // Main roof cone
    const roofCone = new THREE.Mesh(
        new THREE.ConeGeometry(6, 6, 4),
        new THREE.MeshStandardMaterial({
            color: 0x1a0f0a,
            roughness: 0.7,
            metalness: 0.3,
            emissive: 0x0f0705,
            emissiveIntensity: 0.2
        })
    );
    roofGroup.add(roofCone);

    // Add magical crystals along roof edges
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const crystal = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.8, 6),
            new THREE.MeshStandardMaterial({
                color: 0xff6600,
                emissive: 0xff6600,
                emissiveIntensity: 1,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        crystal.position.set(
            Math.cos(angle) * 5,
            -2,
            Math.sin(angle) * 5
        );
        crystal.lookAt(0, 0, 0);
        roofGroup.add(crystal);

        const crystalLight = new THREE.PointLight(0xff6600, 0.5, 2);
        crystalLight.position.copy(crystal.position);
        roofGroup.add(crystalLight);
    }

    roofGroup.position.y = 11;
    roofGroup.rotation.y = Math.PI / 4;
    house.add(roofGroup);

    // Enhanced windows with magical effects
    const windowPositions = [
        { x: -2.5, y: 5, z: 3.6 },
        { x: 2.5, y: 5, z: 3.6 },
        { x: 0, y: 7, z: 3.6 }
    ];

    windowPositions.forEach(pos => {
        // Window frame with detailed woodwork
        const frameGroup = new THREE.Group();
        
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 0.3),
            new THREE.MeshStandardMaterial({
                color: 0x2a1810,
                roughness: 0.8,
                metalness: 0.2
            })
        );
        frameGroup.add(frame);

        // Add frame details
        const frameDetail = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.2, 0.4),
            new THREE.MeshStandardMaterial({
                color: 0x1a0f0a,
                roughness: 0.9,
                metalness: 0.1
            })
        );
        frameDetail.position.y = 1;
        frameGroup.add(frameDetail);

        const frameDetail2 = frameDetail.clone();
        frameDetail2.position.y = -1;
        frameGroup.add(frameDetail2);

        frameGroup.position.set(pos.x, pos.y, pos.z);
        house.add(frameGroup);

        // Magical window glow
        const glow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2, 1.7),
            new THREE.MeshStandardMaterial({
                color: 0xff6600,
                emissive: 0xff6600,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            })
        );
        glow.position.set(pos.x, pos.y, pos.z + 0.2);
        house.add(glow);

        // Add swirling magical particles
        const particles = new THREE.Group();
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: 0xff6600,
                    emissive: 0xff6600,
                    emissiveIntensity: 2,
                    metalness: 1,
                    roughness: 0
                })
            );
            
            const animate = () => {
                const time = Date.now() * 0.001;
                particle.position.x = Math.cos(time + i) * 0.4;
                particle.position.y = Math.sin(time * 2 + i) * 0.4;
                requestAnimationFrame(animate);
            };
            animate();
            
            particles.add(particle);
        }
        
        particles.position.set(pos.x, pos.y, pos.z + 0.3);
        house.add(particles);

        const windowLight = new THREE.PointLight(0xff6600, 1, 5);
        windowLight.position.set(pos.x, pos.y, pos.z);
        house.add(windowLight);
    });

    // Enhanced magical chimney
    const chimneyGroup = new THREE.Group();
    
    const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 4, 1.5),
        new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 1,
            metalness: 0.2,
            emissive: 0x0f0f0f,
            emissiveIntensity: 0.2
        })
    );
    chimneyGroup.add(chimney);

    // Add magical smoke effect
    const smokeParticles = new THREE.Group();
    const smokeCount = 8;
    
    for (let i = 0; i < smokeCount; i++) {
        const smoke = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0xff6600,
                emissive: 0xff6600,
                transparent: true,
                opacity: 0.3
            })
        );
        
        const animate = () => {
            const time = Date.now() * 0.001;
            smoke.position.y = (i * 0.5) + Math.sin(time + i) * 0.2;
            smoke.position.x = Math.sin(time * 0.5 + i) * 0.3;
            smoke.position.z = Math.cos(time * 0.5 + i) * 0.3;
            smoke.material.opacity = 0.3 - (smoke.position.y * 0.05);
            requestAnimationFrame(animate);
        };
        animate();
        
        smokeParticles.add(smoke);
    }
    
    smokeParticles.position.y = 2;
    chimneyGroup.add(smokeParticles);

    chimneyGroup.position.set(2, 12, 0);
    chimneyGroup.rotation.z = Math.PI * 0.05;
    house.add(chimneyGroup);

    // Add magical mist around base
    const mistCount = 15;
    for (let i = 0; i < mistCount; i++) {
        const mist = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.8),
            new THREE.MeshStandardMaterial({
                color: 0xff6600,
                emissive: 0xff6600,
                transparent: true,
                opacity: 0.2
            })
        );
        const angle = (i / mistCount) * Math.PI * 2;
        const radius = 3.5 + Math.random();
        mist.position.set(
            Math.cos(angle) * radius,
            0.1,
            Math.sin(angle) * radius
        );
        mist.rotation.x = -Math.PI / 2;

        const animate = () => {
            const time = Date.now() * 0.001;
            mist.position.y = 0.1 + Math.sin(time + angle) * 0.1;
            mist.material.opacity = 0.2 + Math.sin(time * 2 + angle) * 0.1;
            requestAnimationFrame(animate);
        };
        animate();

        house.add(mist);
    }

    return house;
}

export function createAlchemyBuilding() {
    const building = new THREE.Group();
    
    // Enhanced stone base with magical runes
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4.5, 1, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x2a1f2d,
            roughness: 0.9,
            metalness: 0.3,
            emissive: 0x1a0f1f,
            emissiveIntensity: 0.2
        })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    building.add(base);

    // Add glowing runes around the base
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const rune = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            })
        );
        rune.position.set(
            Math.cos(angle) * 4.2,
            0.6,
            Math.sin(angle) * 4.2
        );
        rune.rotation.x = -Math.PI / 2;
        building.add(rune);

        const runeLight = new THREE.PointLight(0x00ffff, 0.5, 2);
        runeLight.position.copy(rune.position);
        runeLight.position.y += 0.1;
        building.add(runeLight);
    }

    // Main tower with twisted segments
    const segments = 8;
    const segmentHeight = 1.5;
    for (let i = 0; i < segments; i++) {
        const segment = new THREE.Mesh(
            new THREE.CylinderGeometry(3.8 - (i * 0.1), 4 - (i * 0.1), segmentHeight, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0x2a1f2d,
                roughness: 0.8,
                metalness: 0.4,
                emissive: 0x1a0f1f,
                emissiveIntensity: 0.1
            })
        );
        segment.position.y = 1 + (i * segmentHeight);
        segment.rotation.y = (i / segments) * Math.PI / 4;
        segment.castShadow = true;
        building.add(segment);
    }

    // Floating magical rings around the tower
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(4.2, 0.1, 16, 32),
            new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 1,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        ring.position.y = 5 + (i * 3);
        building.add(ring);

        // Add ring light
        const ringLight = new THREE.PointLight(0x00ffff, 0.5, 3);
        ringLight.position.copy(ring.position);
        building.add(ringLight);

        // Animate ring
        const animate = () => {
            ring.rotation.y += 0.005;
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Enhanced copper dome with magical crystals
    const dome = new THREE.Group();
    
    // Main dome
    const domeBase = new THREE.Mesh(
        new THREE.SphereGeometry(4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ 
            color: 0x45b39d,
            roughness: 0.4,
            metalness: 0.8,
            emissive: 0x235949,
            emissiveIntensity: 0.2
        })
    );
    dome.position.y = 13;
    dome.add(domeBase);

    // Add crystals around dome
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const crystal = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 1, 6),
            new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 1,
                metalness: 1,
                roughness: 0
            })
        );
        crystal.position.set(
            Math.cos(angle) * 3,
            0.5,
            Math.sin(angle) * 3
        );
        crystal.rotation.x = Math.PI / 2;
        crystal.rotation.z = -angle;
        dome.add(crystal);

        const crystalLight = new THREE.PointLight(0x00ffff, 0.5, 2);
        crystalLight.position.copy(crystal.position);
        dome.add(crystalLight);
    }

    building.add(dome);

    // Add magical windows with swirling effects
    const windowPositions = [
        { x: 4, y: 7, z: 0, ry: 0 },
        { x: -4, y: 7, z: 0, ry: Math.PI },
        { x: 0, y: 7, z: 4, ry: Math.PI / 2 },
        { x: 0, y: 7, z: -4, ry: -Math.PI / 2 }
    ];

    windowPositions.forEach(pos => {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 4, 2),
            new THREE.MeshStandardMaterial({ 
                color: 0x45b39d,
                roughness: 0.4,
                metalness: 0.8,
                emissive: 0x235949,
                emissiveIntensity: 0.2
            })
        );
        frame.position.set(pos.x, pos.y, pos.z);
        frame.rotation.y = pos.ry;
        building.add(frame);

        // Create swirling magical effect
        const particles = new THREE.Group();
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x00ffff,
                    emissive: 0x00ffff,
                    emissiveIntensity: 2,
                    metalness: 1,
                    roughness: 0
                })
            );
            
            const animate = () => {
                const time = Date.now() * 0.001;
                particle.position.x = Math.cos(time + i) * 0.4;
                particle.position.y = Math.sin(time * 2 + i) * 0.4;
                requestAnimationFrame(animate);
            };
            animate();
            
            particles.add(particle);
        }
        
        particles.position.set(pos.x, pos.y, pos.z + 0.3);
        building.add(particles);

        const windowLight = new THREE.PointLight(0x00ffff, 1, 8);
        windowLight.position.set(pos.x * 0.8, pos.y, pos.z * 0.8);
        building.add(windowLight);
    });

    // Add magical mist effect at the base
    const mistCount = 20;
    for (let i = 0; i < mistCount; i++) {
        const mist = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                transparent: true,
                opacity: 0.3
            })
        );
        const angle = (i / mistCount) * Math.PI * 2;
        const radius = 4 + Math.random();
        mist.position.set(
            Math.cos(angle) * radius,
            0.1,
            Math.sin(angle) * radius
        );
        mist.rotation.x = -Math.PI / 2;

        // Animate mist
        const animate = () => {
            const time = Date.now() * 0.001;
            mist.position.y = 0.1 + Math.sin(time + angle) * 0.1;
            mist.material.opacity = 0.3 + Math.sin(time * 2 + angle) * 0.1;
            requestAnimationFrame(animate);
        };
        animate();

        building.add(mist);
    }

    // Add flag for click handler
    building.userData.isAlchemyBuilding = true;

    return building;
}
