export function createDetailedLantern(x, z) {
    const lantern = new THREE.Group();
    
    // Rustic pole
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

    // Lantern housing
    const housingGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const housingMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7
    });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 3;
    housing.rotation.y = Math.PI / 4;
    lantern.add(housing);

    // Glowing core
    const glowGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff9933,
        transparent: true,
        opacity: 0.9
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 3;
    lantern.add(glow);

    // Point light
    const light = new THREE.PointLight(0xff9933, 1, 8);
    light.position.y = 3;
    lantern.add(light);

    // Small decorative top
    const topGeo = new THREE.ConeGeometry(0.3, 0.4, 4);
    const top = new THREE.Mesh(topGeo, poleMat);
    top.position.y = 3.5;
    lantern.add(top);

    // Position the lantern
    lantern.position.set(x, 0, z);
    // Add slight random rotation for variety
    lantern.rotation.y = Math.random() * Math.PI * 2;

    return lantern;
}
