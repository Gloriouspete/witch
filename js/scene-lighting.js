import * as THREE from 'three';
import { scene } from './scene-setup.js';

export function createLightBulb() {
    const bulbGroup = new THREE.Group();

    // Glass bulb
    const glassGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0.6,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    bulbGroup.add(glass);

    // Metallic base
    const baseGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.2, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.15;
    bulbGroup.add(base);

    // Inner glow sphere
    const glowGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0.8
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    bulbGroup.add(glow);

    return bulbGroup;
}

function createSconce() {
    const sconceGroup = new THREE.Group();

    // Main bracket
    const bracketMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.3
    });

    // Wall mount
    const mount = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8),
        bracketMaterial
    );
    mount.rotation.z = Math.PI / 2;
    sconceGroup.add(mount);

    // Arm
    const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
        bracketMaterial
    );
    arm.position.set(0.2, 0, 0);
    arm.rotation.z = Math.PI / 2;
    sconceGroup.add(arm);

    // Decorative curl at the end
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.05, 0.05, 0),
        new THREE.Vector3(0.1, 0.05, 0),
        new THREE.Vector3(0.1, 0, 0),
    ]);

    const curveGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
    const curlEnd = new THREE.Mesh(curveGeometry, bracketMaterial);
    curlEnd.position.set(0.4, 0, 0);
    sconceGroup.add(curlEnd);

    return sconceGroup;
}

function createFlameSprite() {
    const flameCanvas = document.createElement('canvas');
    const ctx = flameCanvas.getContext('2d');
    flameCanvas.width = 64;
    flameCanvas.height = 64;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 230, 150, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 160, 50, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 100, 50, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const flameTexture = new THREE.CanvasTexture(flameCanvas);
    return new THREE.SpriteMaterial({
        map: flameTexture,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
}

export function createSign() {
    const signGroup = new THREE.Group();

    // Create wood texture
    const woodTexture = new THREE.CanvasTexture(createWoodTexture());
    
    // Create text texture
    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d');
    textCanvas.width = 512;
    textCanvas.height = 256;
    
    // Text settings
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
    
    // Main text
    ctx.font = 'bold 72px "Times New Roman"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    // Gold gradient
    const gradient = ctx.createLinearGradient(0, textCanvas.height/2 - 30, 0, textCanvas.height/2 + 30);
    gradient.addColorStop(0, '#ffd700');
    gradient.addColorStop(0.5, '#ffec8b');
    gradient.addColorStop(1, '#ffd700');
    
    // Draw text
    ctx.fillStyle = gradient;
    ctx.fillText('Mystic Chemicals', textCanvas.width/2, textCanvas.height/2);
    
    const textTexture = new THREE.CanvasTexture(textCanvas);

    // Create main sign board with beveled edges
    const signGeometry = new THREE.BoxGeometry(5, 1.5, 0.2);
    const signMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
        metalness: 0.3,
        roughness: 0.7,
        bumpMap: woodTexture,
        bumpScale: 0.05
    });
    const signBoard = new THREE.Mesh(signGeometry, signMaterial);
    signBoard.castShadow = true;
    signBoard.receiveShadow = true;

    // Create metallic frame
    const frameGeometry = new THREE.BoxGeometry(5.2, 1.7, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.3
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -0.1;
    frame.castShadow = true;
    frame.receiveShadow = true;

    // Create text overlay
    const textGeometry = new THREE.PlaneGeometry(4.8, 1.3);
    const textMaterial = new THREE.MeshStandardMaterial({
        map: textTexture,
        transparent: true,
        metalness: 0.5,
        roughness: 0.3
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = 0.11;

    signGroup.add(frame);
    signGroup.add(signBoard);
    signGroup.add(textMesh);
    signGroup.position.set(0, 6.5, -3.8);

    return signGroup;
}

export function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x333333, 0.8);
    scene.add(ambientLight);

    const sconcePositions = [
        { x: -5.85, y: 4, z: -3, isLeft: true },
        { x: 5.85, y: 4, z: -3, isLeft: false },
        { x: -5.85, y: 4, z: 1, isLeft: true },
        { x: 5.85, y: 4, z: 1, isLeft: false }
    ];

    sconcePositions.forEach(pos => {
        // Add sconce fixture
        const sconce = createSconce();
        sconce.position.set(pos.x, pos.y, pos.z);
        if (!pos.isLeft) {
            sconce.rotation.y = Math.PI;
        }
        scene.add(sconce);

        // Sconce light with more natural color
        const sconceLight = new THREE.PointLight(0xffa366, 1.5, 8, 2);
        const lightOffset = pos.isLeft ? 0.45 : -0.45;
        sconceLight.position.set(pos.x + lightOffset, pos.y, pos.z);
        sconceLight.castShadow = true;
        sconceLight.shadow.mapSize.width = 512;
        sconceLight.shadow.mapSize.height = 512;
        scene.add(sconceLight);

        // Add bulb model
        const bulb = createLightBulb();
        bulb.position.copy(sconceLight.position);
        if (!pos.isLeft) {
            bulb.rotation.z = Math.PI;
        }
        scene.add(bulb);

        // Create realistic flame sprite
        const flameMaterial = createFlameSprite();
        const flame = new THREE.Sprite(flameMaterial);
        flame.position.copy(sconceLight.position);
        const flameOffset = pos.isLeft ? 0.1 : -0.1;
        flame.position.x += flameOffset;
        flame.position.y += 0.2;
        flame.scale.set(0.5, 0.8, 0.5);
        scene.add(flame);

        // Add subtle glow light
        const glowLight = new THREE.PointLight(0xff8533, 0.4, 4, 2);
        glowLight.position.copy(sconceLight.position);
        scene.add(glowLight);
    });
}

let lastFlameUpdate = 0;
const FLAME_UPDATE_INTERVAL = 100; // Update every 100ms for smoother animation

export function animateFlames() {
    const currentTime = Date.now();
    if (currentTime - lastFlameUpdate > FLAME_UPDATE_INTERVAL) {
        scene.children.forEach(child => {
            if (child.type === 'Sprite') {
                const time = currentTime * 0.001;
                // Slower, more natural flame movement
                child.scale.x = 0.4 + Math.sin(time * 0.5) * 0.05;
                child.scale.y = 0.7 + Math.sin(time * 0.7) * 0.08;
                // Subtle position animation
                child.position.y += Math.sin(time) * 0.0005;
                child.position.x += Math.cos(time) * 0.0002;
            }
            if (child.type === 'PointLight' && child.intensity < 1) {
                // Slower light intensity animation
                const time = currentTime * 0.001;
                child.intensity = 0.7 + Math.sin(time * 0.5) * 0.05;
            }
        });
        lastFlameUpdate = currentTime;
    }
}
