export function createTerrain() {
    const terrainGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
    const vertices = terrainGeo.attributes.position.array;
    
    // Perlin noise would be ideal here, but let's create a similar effect
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        
        // Create base terrain with rolling hills
        let height = Math.sin(x / 15) * Math.cos(z / 15) * 2 +
                    Math.sin(x / 30 + z / 30) * 3 +
                    Math.cos(x / 20 - z / 20) * 2;
        
        // Add some random variation for more natural look
        height += Math.sin(x / 5) * Math.cos(z / 5) * 0.5;
        
        // Create a small clearing for the witch's house
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        if (distanceFromCenter < 10) {
            // Flatten the area for the witch's house
            height = height * (distanceFromCenter / 10) * 0.5;
        }
        
        // Add some sharp features for rocks
        if (Math.random() > 0.98) {
            height += Math.random() * 3;
        }
        
        vertices[i + 1] = height;
    }

    // Create a darker, forest floor material
    const terrainMat = new THREE.MeshStandardMaterial({
        color: 0x1a2910, // Dark forest green
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true // Enable flat shading for more dramatic terrain
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;

    // Add ground details
    const detailsGroup = new THREE.Group();
    
    // Add scattered rocks
    for (let i = 0; i < 50; i++) {
        const rockGeo = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.2);
        const rockMat = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.9,
            metalness: 0.1
        });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        
        // Position rocks randomly but avoid the center clearing
        let x, z;
        do {
            x = (Math.random() - 0.5) * 180;
            z = (Math.random() - 0.5) * 180;
        } while (Math.sqrt(x * x + z * z) < 15);
        
        rock.position.set(x, 0, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.receiveShadow = true;
        detailsGroup.add(rock);
    }

    // Create patches of darker ground
    for (let i = 0; i < 100; i++) {
        const patchGeo = new THREE.CircleGeometry(Math.random() * 2 + 1, 5);
        const patchMat = new THREE.MeshStandardMaterial({
            color: 0x0a0f05,
            roughness: 1,
            metalness: 0
        });
        const patch = new THREE.Mesh(patchGeo, patchMat);
        
        const x = (Math.random() - 0.5) * 180;
        const z = (Math.random() - 0.5) * 180;
        
        patch.position.set(x, 0.01, z);
        patch.rotation.x = -Math.PI / 2;
        patch.rotation.z = Math.random() * Math.PI;
        detailsGroup.add(patch);
    }

    terrain.add(detailsGroup);
    return terrain;
}
