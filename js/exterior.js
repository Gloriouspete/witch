import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createWitchHouse, createVillageHouse, createExperimentBuilding } from './objects/house.js';

export function setupExteriorScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001a33); // Dark night sky
    scene.fog = new THREE.FogExp2(0x001a33, 0.015);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a3300,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add witch house on the left
    const witchHouse = createWitchHouse();
    witchHouse.position.set(-15, 0, 0);
    witchHouse.rotation.y = Math.PI / 6;
    scene.add(witchHouse);

    // Add village house in the middle
    const villageHouse = createVillageHouse();
    villageHouse.position.set(0, 0, 0);
    scene.add(villageHouse);

    // Add experiment building on the right
    const experimentBuilding = createExperimentBuilding();
    experimentBuilding.position.set(20, 0, 0);
    experimentBuilding.rotation.y = -Math.PI / 6;
    scene.add(experimentBuilding);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
    scene.add(ambientLight);

    // Moon light
    const moonLight = new THREE.DirectionalLight(0x6666ff, 0.8);
    moonLight.position.set(50, 50, 0);
    moonLight.castShadow = true;
    moonLight.shadow.camera.left = -50;
    moonLight.shadow.camera.right = 50;
    moonLight.shadow.camera.top = 50;
    moonLight.shadow.camera.bottom = -50;
    moonLight.shadow.camera.far = 200;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    scene.add(moonLight);

    // Add some fog particles for atmosphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = Math.random() * 100 - 50;
        positions[i + 1] = Math.random() * 10;
        positions[i + 2] = Math.random() * 100 - 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x666666,
        size: 0.1,
        transparent: true,
        opacity: 0.5,
        fog: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    return scene;
}

export function createExteriorRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export function createExteriorCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 30);
    return camera;
}

export function createExteriorControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    return controls;
}

export function animateExteriorScene(scene, camera, renderer, controls) {
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
