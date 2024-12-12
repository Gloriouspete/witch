export function createTerrain() {
    const terrainGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
    const vertices = terrainGeo.attributes.position.array;
    
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        
        let height = Math.sin(x / 15) * Math.cos(z / 15) * 2 +
                    Math.sin(x / 30 + z / 30) * 3 +
                    Math.cos(x / 20 - z / 20) * 2;
        
        height += Math.sin(x / 5) * Math.cos(z / 5) * 0.5;
        
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        if (distanceFromCenter < 10) {
            height = height * (distanceFromCenter / 10) * 0.5;
        }
        
        if (Math.random() > 0.98) {
            height += Math.random() * 3;
        }
        
        vertices[i + 1] = height;
    }

    const terrainMat = new THREE.MeshStandardMaterial({
        color: 0x1a2910,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;

    return terrain;
}

export function createPath() {
    const pathGroup = new THREE.Group();
    const pathPoints = [];
    
    // Create a winding path through the forest
    const controlPoints = [
        new THREE.Vector3(-25, 0, 25),
        new THREE.Vector3(-15, 0, 15),
        new THREE.Vector3(-5, 0, 10),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, 0, -8),
        new THREE.Vector3(15, 0, -15),
        new THREE.Vector3(25, 0, -20)
    ];

    // Create curves between control points
    for (let i = 0; i < controlPoints.length - 1; i++) {
        const start = controlPoints[i];
        const end = controlPoints[i + 1];
        
        // Add some randomness to path
        const midPoint = new THREE.Vector3(
            (start.x + end.x) / 2 + (Math.random() - 0.5) * 5,
            0,
            (start.z + end.z) / 2 + (Math.random() - 0.5) * 5
        );
        
        // Create points along the curve
        for (let t = 0; t <= 1; t += 0.1) {
            const point = new THREE.Vector3(
                start.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + end.x * t * t,
                0,
                start.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + end.z * t * t
            );
            pathPoints.push(point);
        }
    }

    // Create dirt path
    pathPoints.forEach((point, i) => {
        if (i < pathPoints.length - 1) {
            const width = 2 + Math.random() * 0.5;
            const pathSegGeo = new THREE.PlaneGeometry(
                width,
                point.distanceTo(pathPoints[i + 1])
            );
            
            const pathSegMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x3b2d1d).multiplyScalar(0.8 + Math.random() * 0.4),
                roughness: 0.9,
                metalness: 0.1
            });
            
            const pathSeg = new THREE.Mesh(pathSegGeo, pathSegMat);
            pathSeg.position.set(
                (point.x + pathPoints[i + 1].x) / 2,
                0.01,
                (point.z + pathPoints[i + 1].z) / 2
            );
            
            pathSeg.lookAt(pathPoints[i + 1].x, 0.01, pathPoints[i + 1].z);
            pathSeg.rotateX(-Math.PI / 2);
            pathSeg.rotation.z += (Math.random() - 0.5) * 0.1;
            
            pathGroup.add(pathSeg);
        }
    });

    return { pathGroup, pathPoints };
}

export function createVillageHouse() {
    const house = new THREE.Group();
    
    // Base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.5, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a3b22, roughness: 0.9 })
    );
    base.position.y = 0.25;
    base.castShadow = true;
    house.add(base);

    // Main structure
    const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 3, 3.8),
        new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 })
    );
    mainBody.position.y = 2;
    mainBody.castShadow = true;
    house.add(mainBody);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3, 2, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a3b22, roughness: 0.7 })
    );
    roof.position.y = 4.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // Window
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

    // Door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.9 })
    );
    door.position.set(0, 1.25, 1.91);
    house.add(door);

    return house;
}

export function createWitchHouse() {
    const house = new THREE.Group();
    
    // Base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.9 })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    house.add(base);

    // Main structure
    const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(7, 8, 7),
        new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.8 })
    );
    mainBody.position.y = 4.5;
    mainBody.rotation.y = Math.PI * 0.02;
    mainBody.castShadow = true;
    house.add(mainBody);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(6, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.7 })
    );
    roof.position.y = 11;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // Windows with glow
    const windowPositions = [
        { x: -2.5, y: 5, z: 3.6 },
        { x: 2.5, y: 5, z: 3.6 },
        { x: 0, y: 7, z: 3.6 }
    ];

    windowPositions.forEach(pos => {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x2a1810 })
        );
        frame.position.set(pos.x, pos.y, pos.z);
        house.add(frame);

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

        const light = new THREE.PointLight(0xff6600, 1, 5);
        light.position.set(pos.x, pos.y, pos.z);
        house.add(light);
    });

    // Add chimney
    const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 4, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 })
    );
    chimney.position.set(2, 12, 0);
    chimney.rotation.z = Math.PI * 0.05;
    house.add(chimney);

    return house;
}

export function createPineTree(height = 1) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2 * height, 0.3 * height, 2 * height, 8),
        new THREE.MeshStandardMaterial({
            color: 0x3a2510,
            roughness: 0.9
        })
    );
    trunk.position.y = height;
    trunk.castShadow = true;
    tree.add(trunk);

    const numLayers = 5;
    for (let i = 0; i < numLayers; i++) {
        const y = (i + 1) * height;
        const size = (numLayers - i) / numLayers;
        
        const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(1.5 * size * height, 2 * height, 8),
            new THREE.MeshStandardMaterial({
                color: 0x1a4220,
                roughness: 0.8
            })
        );
        foliage.position.y = y + height;
        foliage.castShadow = true;
        tree.add(foliage);
    }

    return tree;
}

export function createForest(x, z, radius = 5) {
    const forest = new THREE.Group();
    const numTrees = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < numTrees; i++) {
        const angle = (i / numTrees) * Math.PI * 2 + Math.random() * 0.5;
        const distance = Math.random() * radius;
        const posX = x + Math.cos(angle) * distance;
        const posZ = z + Math.sin(angle) * distance;
        const height = 0.8 + Math.random() * 0.4;

        const tree = createPineTree(height);
        tree.position.set(posX, 0, posZ);
        tree.rotation.y = Math.random() * Math.PI * 2;
        forest.add(tree);
    }

    return forest;
}

export function createDetailedLantern(x, z) {
    const lantern = new THREE.Group();
    
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.15, 3, 6);
    const poleMat = new THREE.MeshStandardMaterial({
        color: 0x2a1810,
        roughness: 0.9
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.5;
    pole.rotation.y = Math.PI / 6;
    pole.castShadow = true;
    lantern.add(pole);

    const housingGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const housingMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7
    });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 3;
    housing.rotation.y = Math.PI / 4;
    lantern.add(housing);

    const glowGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff9933,
        transparent: true,
        opacity: 0.9
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 3;
    lantern.add(glow);

    const light = new THREE.PointLight(0xff9933, 1, 8);
    light.position.y = 3;
    lantern.add(light);

    lantern.position.set(x, 0, z);
    lantern.rotation.y = Math.random() * Math.PI * 2;

    return lantern;
}
