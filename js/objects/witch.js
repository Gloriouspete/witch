import * as THREE from 'three';

export function createWitch() {
    const witch = new THREE.Group();

    // Robe (main body) - made more flowing with multiple segments
    const robeTop = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 1.2, 12),
        new THREE.MeshStandardMaterial({
            color: 0x4a0066,
            roughness: 0.7,
            metalness: 0.3
        })
    );
    robeTop.position.y = 2;
    witch.add(robeTop);

    const robeBottom = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 1.8, 12),
        new THREE.MeshStandardMaterial({
            color: 0x380050,
            roughness: 0.8,
            metalness: 0.2
        })
    );
    robeBottom.position.y = 1;
    witch.add(robeBottom);

    // Add robe details (folds)
    for (let i = 0; i < 8; i++) {
        const fold = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.5, 0.1),
            new THREE.MeshStandardMaterial({
                color: 0x2a003a,
                roughness: 0.9,
                metalness: 0.1
            })
        );
        const angle = (i / 8) * Math.PI * 2;
        fold.position.set(
            Math.cos(angle) * 0.9,
            1.5,
            Math.sin(angle) * 0.9
        );
        fold.rotation.x = Math.random() * 0.2;
        witch.add(fold);
    }

    // Head with more detail
    const head = new THREE.Group();
    
    // Base head shape
    const headMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x2d2d2d,
            roughness: 0.7,
            metalness: 0.2
        })
    );
    head.add(headMesh);

    // Nose
    const nose = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.2, 8),
        new THREE.MeshStandardMaterial({
            color: 0x2d2d2d,
            roughness: 0.8,
            metalness: 0.1
        })
    );
    nose.rotation.x = -Math.PI / 2;
    nose.position.set(0, 0, 0.4);
    head.add(nose);

    head.position.y = 2.7;
    witch.add(head);

    // Hat with more detail
    const hatBase = new THREE.Group();
    
    // Hat brim
    const brim = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.1, 16, 32),
        new THREE.MeshStandardMaterial({
            color: 0x4a0066,
            roughness: 0.8,
            metalness: 0.2
        })
    );
    brim.rotation.x = Math.PI / 2;
    brim.position.y = 3.1;
    hatBase.add(brim);

    // Hat cone with texture-like detail
    const hatCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 1.2, 16),
        new THREE.MeshStandardMaterial({
            color: 0x4a0066,
            roughness: 0.8,
            metalness: 0.2
        })
    );
    hatCone.position.y = 3.7;
    hatBase.add(hatCone);

    // Add hat details (bands)
    const hatBand = new THREE.Mesh(
        new THREE.TorusGeometry(0.41, 0.05, 8, 32),
        new THREE.MeshStandardMaterial({
            color: 0x8800cc,
            emissive: 0x8800cc,
            emissiveIntensity: 0.2,
            metalness: 0.8,
            roughness: 0.2
        })
    );
    hatBand.rotation.x = Math.PI / 2;
    hatBand.position.y = 3.3;
    hatBase.add(hatBand);

    witch.add(hatBase);

    // Hat tip with enhanced magical glow
    const hatTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.4, 8),
        new THREE.MeshStandardMaterial({
            color: 0x8800cc,
            emissive: 0x8800cc,
            emissiveIntensity: 0.5,
            roughness: 0.4,
            metalness: 0.6
        })
    );
    hatTip.position.y = 4.3;
    witch.add(hatTip);

    // Enhanced magical glow to hat tip
    const hatLight = new THREE.PointLight(0x8800cc, 1, 3);
    hatLight.position.copy(hatTip.position);
    witch.add(hatLight);

    // Add magical beam from hat tip
    const beamGroup = new THREE.Group();
    
    // Inner beam
    const innerBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.02, 10, 8, 1, true),
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
        new THREE.CylinderGeometry(0.1, 0.04, 10, 8, 1, true),
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
    beamGroup.position.y = 9.3;
    witch.add(beamGroup);

    // Beam particles
    const beamParticleCount = 15;
    const beamParticles = new THREE.Group();
    const beamParticlePairs = [];

    for (let i = 0; i < beamParticleCount; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 8, 8),
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
    
    witch.add(beamParticles);

    // More detailed arms
    const createArm = (isLeft) => {
        const arm = new THREE.Group();
        
        // Upper arm
        const upperArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8),
            new THREE.MeshStandardMaterial({
                color: 0x4a0066,
                roughness: 0.7,
                metalness: 0.3
            })
        );
        upperArm.position.y = -0.4;
        arm.add(upperArm);

        // Lower arm
        const lowerArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.06, 0.8, 8),
            new THREE.MeshStandardMaterial({
                color: 0x4a0066,
                roughness: 0.7,
                metalness: 0.3
            })
        );
        lowerArm.position.y = -1;
        arm.add(lowerArm);

        // Hand
        const hand = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0x2d2d2d,
                roughness: 0.7,
                metalness: 0.2
            })
        );
        hand.position.y = -1.4;
        arm.add(hand);

        arm.position.set(isLeft ? -0.8 : 0.8, 2.5, 0);
        arm.rotation.z = isLeft ? Math.PI / 4 : -Math.PI / 4;
        return arm;
    };

    witch.add(createArm(true));  // Left arm
    witch.add(createArm(false)); // Right arm

    // Enhanced staff
    const staff = new THREE.Group();

    // Staff body with texture-like details
    const staffBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 2.5, 12),
        new THREE.MeshStandardMaterial({
            color: 0x4a2700,
            roughness: 0.9,
            metalness: 0.1
        })
    );
    staff.add(staffBody);

    // Staff rings
    for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.08, 0.02, 8, 16),
            new THREE.MeshStandardMaterial({
                color: 0x2a1600,
                roughness: 0.7,
                metalness: 0.4
            })
        );
        ring.position.y = -1 + i * 0.5;
        ring.rotation.x = Math.PI / 2;
        staff.add(ring);
    }

    staff.position.set(1.2, 1.8, 0);
    staff.rotation.z = -Math.PI / 12;
    witch.add(staff);

    // Enhanced magical orb
    const orbGroup = new THREE.Group();
    
    // Core orb
    const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1,
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.8
        })
    );
    orbGroup.add(orb);

    // Outer glow
    const orbGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.3
        })
    );
    orbGroup.add(orbGlow);

    orbGroup.position.set(1.3, 3, 0);
    witch.add(orbGroup);

    // Enhanced magical glow to orb
    const orbLight = new THREE.PointLight(0x00ff00, 1, 3);
    orbLight.position.copy(orbGroup.position);
    witch.add(orbLight);

    // Enhanced floating magical particles
    const particleCount = 30; // Increased particle count
    const particles = new THREE.Group();
    const particlePairs = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.03, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 2,
            metalness: 1,
            roughness: 0
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 1 + Math.random() * 0.8;
        particle.position.set(
            Math.cos(angle) * radius,
            Math.random() * 4,
            Math.sin(angle) * radius
        );
        
        const particleLight = new THREE.PointLight(0x00ff00, 0.2, 1);
        particleLight.position.copy(particle.position);
        
        particles.add(particle);
        particles.add(particleLight);
        particlePairs.push({ particle, light: particleLight });
    }
    
    witch.add(particles);

    // Enhanced particle animation
    const animate = () => {
        particlePairs.forEach((pair, index) => {
            const time = Date.now() * 0.001;
            const angle = ((index / particleCount) * Math.PI * 2) + time * 0.5;
            const verticalOffset = Math.sin(time * 2 + index) * 0.2;
            const radius = 1 + Math.sin(time + index) * 0.3;
            
            pair.particle.position.x = Math.cos(angle) * radius;
            pair.particle.position.z = Math.sin(angle) * radius;
            pair.particle.position.y += Math.sin(time * 2 + index) * 0.01;
            pair.particle.scale.setScalar(0.8 + Math.sin(time * 3 + index) * 0.2);
            
            pair.light.position.copy(pair.particle.position);
            pair.light.intensity = 0.2 + Math.sin(time * 4 + index) * 0.1;
        });

        // Animate beam particles
        beamParticlePairs.forEach((pair, index) => {
            const time = Date.now() * 0.001;
            const yPos = 4.3 + (index / beamParticlePairs.length) * 10;
            const angle = time * 2 + (index / beamParticlePairs.length) * Math.PI * 2;
            const radius = 0.05 * Math.sin(time * 3 + index);
            
            pair.particle.position.set(
                Math.cos(angle) * radius,
                yPos + Math.sin(time * 2 + index) * 0.1,
                Math.sin(angle) * radius
            );
            pair.light.position.copy(pair.particle.position);
            pair.particle.scale.setScalar(0.3 + Math.sin(time * 4 + index) * 0.1);
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();

    return witch;
}
