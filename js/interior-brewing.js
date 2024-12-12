import { createCauldron } from './cauldron.js';
import { createBrewingUI } from './brewing-ui.js';

export function setupBrewing(scene, cauldronLight) {
    // Create cauldron and get its components
    const { cauldron, liquid, bubbles, animate } = createCauldron();
    scene.add(cauldron);

    // Create brewing UI with cauldron components
    createBrewingUI(liquid, bubbles, cauldronLight);

    return { animate };
}
