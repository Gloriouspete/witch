import { setupScene } from './interior-scene.js';
import { setupBrewing } from './interior-brewing.js';
import { initializeInventory } from './inventory-system.js';

try {
    // Initialize inventory system
    initializeInventory();

    // Setup scene and get necessary components
    const { scene, camera, renderer, controls, cauldronLight } = setupScene();

    // Setup brewing system and get animation functions
    const { animate: animateBrewing } = setupBrewing(scene, cauldronLight);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        
        animateBrewing(time);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

} catch (error) {
    document.getElementById('error').textContent = error.toString();
    console.error(error);
}
