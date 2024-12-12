import { scene } from './scene.js';

function createMoon() {
    const moonGroup = new THREE.Group();
    
    // Larger moon for dramatic effect
    const moonGeo = new THREE.SphereGeometry(8, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
        color: 0xc2d1d9, // Slightly blueish moon
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    // Enhanced moon glow
    const moonGlowGeo = new THREE.SphereGeometry(10, 32, 32);
    const moonGlowMat = new THREE.MeshBasicMaterial({
        color: 0xc2d1d9,
        transparent: true,
        opacity: 0.2
    });
    const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
    moonGroup.add(moonGlow);

    // Additional outer glow for mystical effect
    const outerGlowGeo = new THREE.SphereGeometry(12, 32, 32);
    const outerGlowMat = new THREE.MeshBasicMaterial({
        color: 0x8494a7,
        transparent: true,
        opacity: 0.1
    });
    const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
    moonGroup.add(outerGlow);

    moonGroup.position.set(80, 100, -80);
    
    return moonGroup;
}

export function setupLighting() {
    // Moonlight
    const moonLight = new THREE.DirectionalLight(0xc2d1d9, 0.3);
    moonLight.position.set(80, 100, -80);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.far = 300;
    moonLight.shadow.camera.left = -100;
    moonLight.shadow.camera.right = 100;
    moonLight.shadow.camera.top = 100;
    moonLight.shadow.camera.bottom = -100;
    scene.add(moonLight);

    // Very dim ambient light for deep shadows
    const ambientLight = new THREE.AmbientLight(0x1a2530, 0.2);
    scene.add(ambientLight);

    // Add subtle blue-tinted ground fog light
    const fogLight = new THREE.HemisphereLight(0x2a3040, 0x0a1520, 0.2);
    scene.add(fogLight);

    // Add some randomly placed point lights for fireflies/magical effect
    for (let i = 0; i < 20; i++) {
        const light = new THREE.PointLight(0x80ff80, 0.5, 5);
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 40;
        light.position.set(
            Math.cos(angle) * radius,
            0.5 + Math.random() * 2,
            Math.sin(angle) * radius
        );
        scene.add(light);
    }

    // Add moon object
    const moon = createMoon();
    scene.add(moon);
}
