export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1510);
    scene.fog = new THREE.FogExp2(0x0a1510, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(15, 10, 15);  // Closer starting position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;  // Reduced from 10 to allow closer viewing
    controls.maxDistance = 50;
    controls.target.set(0, 3, 0);  // Adjusted to look at the middle of the house

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, controls };
}

export function setupLighting(scene) {
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

    const ambientLight = new THREE.AmbientLight(0x1a2530, 0.2);
    scene.add(ambientLight);

    const fogLight = new THREE.HemisphereLight(0x2a3040, 0x0a1520, 0.2);
    scene.add(fogLight);

    // Add fireflies
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

    // Create moon
    const moonGroup = new THREE.Group();
    const moonGeo = new THREE.SphereGeometry(8, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xc2d1d9 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    const moonGlowGeo = new THREE.SphereGeometry(10, 32, 32);
    const moonGlowMat = new THREE.MeshBasicMaterial({
        color: 0xc2d1d9,
        transparent: true,
        opacity: 0.2
    });
    const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
    moonGroup.add(moonGlow);

    moonGroup.position.set(80, 100, -80);
    scene.add(moonGroup);
}

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
    
    const controlPoints = [
        new THREE.Vector3(-25, 0, 25),
        new THREE.Vector3(-15, 0, 15),
        new THREE.Vector3(-5, 0, 10),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, 0, -8),
        new THREE.Vector3(15, 0, -15),
        new THREE.Vector3(25, 0, -20)
    ];

    for (let i = 0; i < controlPoints.length - 1; i++) {
        const start = controlPoints[i];
        const end = controlPoints[i + 1];
        
        const midPoint = new THREE.Vector3(
            (start.x + end.x) / 2 + (Math.random() - 0.5) * 5,
            0,
            (start.z + end.z) / 2 + (Math.random() - 0.5) * 5
        );
        
        for (let t = 0; t <= 1; t += 0.1) {
            const point = new THREE.Vector3(
                start.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + end.x * t * t,
                0,
                start.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + end.z * t * t
            );
            pathPoints.push(point);
        }
    }

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
