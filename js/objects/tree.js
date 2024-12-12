import * as THREE from 'three';

function createPineTree(height = 1) {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.2 * height, 0.3 * height, 2 * height, 8);
    const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x3a2510,
        roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = height;
    trunk.castShadow = true;
    tree.add(trunk);

    // Multiple layers of foliage
    const numLayers = 5;
    for (let i = 0; i < numLayers; i++) {
        const y = (i + 1) * height;
        const size = (numLayers - i) / numLayers;
        
        const foliageGeo = new THREE.ConeGeometry(1.5 * size * height, 2 * height, 8);
        const foliageMat = new THREE.MeshStandardMaterial({
            color: 0x1a4220,
            roughness: 0.8
        });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.y = y + height;
        foliage.castShadow = true;
        tree.add(foliage);
    }

    return tree;
}

function createDeadTree(height = 1) {
    const tree = new THREE.Group();

    // Twisted trunk
    const trunkGeo = new THREE.CylinderGeometry(0.2 * height, 0.4 * height, 4 * height, 8);
    const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x2a1810,
        roughness: 1
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2 * height;
    trunk.rotation.z = Math.random() * 0.2 - 0.1;
    trunk.castShadow = true;
    tree.add(trunk);

    // Add bare branches
    const numBranches = 4;
    for (let i = 0; i < numBranches; i++) {
        const branchGeo = new THREE.CylinderGeometry(0.1 * height, 0.15 * height, 2 * height, 4);
        const branch = new THREE.Mesh(branchGeo, trunkMat);
        branch.position.y = (2 + i) * height;
        branch.rotation.z = Math.PI * 0.2 + (Math.random() * 0.4 - 0.2);
        branch.rotation.y = (i / numBranches) * Math.PI * 2;
        branch.castShadow = true;
        tree.add(branch);
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

        const tree = Math.random() > 0.2 ? 
            createPineTree(height) : 
            createDeadTree(height);

        tree.position.set(posX, 0, posZ);
        tree.rotation.y = Math.random() * Math.PI * 2;
        forest.add(tree);
    }

    return forest;
}
