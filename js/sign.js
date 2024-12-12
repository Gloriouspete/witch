import * as THREE from 'three';
import { createWoodTexture } from './wood-texture.js';

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
