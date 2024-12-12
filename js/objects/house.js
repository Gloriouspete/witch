xexport function createWitchHouse() {
    const house = new THREE.Group();
    
    // Base/Foundation - dark, aged wood
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    house.add(base);

    // Main structure - crooked and twisted
    const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(7, 8, 7),
        new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.8 })
    );
    mainBody.position.y = 4.5;
    mainBody.rotation.y = Math.PI * 0.02;
    mainBody.castShadow = true;
    house.add(mainBody);

    // Roof - pointed and angular
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(6, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.7 })
    );
    roof.position.y = 11;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // Chimney
    const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 4, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 })
    );
    chimney.position.set(2, 12, 0);
    chimney.rotation.z = Math.PI * 0.05;
    house.add(chimney);

    // Windows with glow
    const windowPositions = [
        { x: -2.5, y: 5, z: 3.6 },
        { x: 2.5, y: 5, z: 3.6 },
        { x: 0, y: 7, z: 3.6 }
    ];

    windowPositions.forEach(pos => {
        // Window frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x2a1810 })
        );
        frame.position.set(pos.x, pos.y, pos.z);
        house.add(frame);

        // Glowing window
        const glow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2, 1.7),
            new THREE.MeshBasicMaterial({
                color: 0xff6600,
                transparent: true,
                opacity: 0.8
            })
        );
        glow.position.set(pos.x, pos.y, pos.z + 0.2);
        house.add(glow);

        // Add point light for window glow
        const light = new THREE.PointLight(0xff6600, 1, 5);
        light.position.set(pos.x, pos.y, pos.z);
        house.add(light);
    });

    // Door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x1a0f0a })
    );
    door.position.set(0, 2, 3.6);
    house.add(door);

    return house;
}

export function createVillageHouse() {
    const house = new THREE.Group();
    
    // Simple foundation
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.5, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a3b22 })
    );
    base.position.y = 0.25;
    base.castShadow = true;
    house.add(base);

    // Main structure
    const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 3, 3.8),
        new THREE.MeshStandardMaterial({ color: 0x8b7355 })
    );
    mainBody.position.y = 2;
    mainBody.castShadow = true;
    house.add(mainBody);

    // Simple roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3, 2, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a3b22 })
    );
    roof.position.y = 4.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // Simple door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x3a2510 })
    );
    door.position.set(0, 1.5, 1.9);
    house.add(door);

    return house;
}

export function createExperimentBuilding() {
    const building = new THREE.Group();
    
    // Stone foundation
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(10, 2, 10),
        new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            roughness: 1.0,
            metalness: 0.2 
        })
    );
    base.position.y = 1;
    base.castShadow = true;
    building.add(base);

    // Main structure - tall and imposing
    const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(9, 12, 9),
        new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.9,
            metalness: 0.3
        })
    );
    mainBody.position.y = 8;
    mainBody.castShadow = true;
    building.add(mainBody);

    // Upper section with different material
    const upperSection = new THREE.Mesh(
        new THREE.BoxGeometry(8, 6, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.4
        })
    );
    upperSection.position.y = 17;
    upperSection.castShadow = true;
    building.add(upperSection);

    // Flat roof with details
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(9, 1, 9),
        new THREE.MeshStandardMaterial({ 
            color: 0x0a0a0a,
            roughness: 0.7,
            metalness: 0.5
        })
    );
    roof.position.y = 20.5;
    roof.castShadow = true;
    building.add(roof);

    // Multiple chimneys for a more industrial look
    const chimneyPositions = [
        { x: 3, z: 3 },
        { x: -3, z: 3 },
        { x: 3, z: -3 },
        { x: -3, z: -3 }
    ];

    chimneyPositions.forEach(pos => {
        const chimney = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 3, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a,
                roughness: 1,
                metalness: 0.3
            })
        );
        chimney.position.set(pos.x, 22, pos.z);
        building.add(chimney);
    });

    // Large windows with green glow
    const windowPositions = [
        { x: 0, y: 8, z: 4.6 },
        { x: 0, y: 14, z: 4.6 },
        { x: -3, y: 11, z: 4.6 },
        { x: 3, y: 11, z: 4.6 }
    ];

    windowPositions.forEach(pos => {
        // Window frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2, 3, 0.4),
            new THREE.MeshStandardMaterial({ 
                color: 0x0a0a0a,
                metalness: 0.5,
                roughness: 0.8
            })
        );
        frame.position.set(pos.x, pos.y, pos.z);
        building.add(frame);

        // Glowing window
        const glow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.7, 2.7),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3
            })
        );
        glow.position.set(pos.x, pos.y, pos.z + 0.3);
        building.add(glow);

        // Add point light for eerie green glow
        const light = new THREE.PointLight(0x00ff00, 0.5, 8);
        light.position.set(pos.x, pos.y, pos.z);
        building.add(light);
    });

    // Heavy metal door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 4, 0.5),
        new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.4
        })
    );
    door.position.set(0, 3, 4.8);
    building.add(door);

    return building;
}
