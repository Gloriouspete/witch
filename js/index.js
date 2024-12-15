import { initWorld } from './world.js';

// Initialize the 3D world when the page loads
// window.addEventListener('DOMContentLoaded', initWorld);
// Check if the browser supports the 'requestIdleCallback' API for lazy-loading
if (window.requestIdleCallback) {
    window.requestIdleCallback(initWorld); // Defer the world initialization to idle time
} else {
    // If the browser doesn't support requestIdleCallback, fall back to setTimeout with a small delay
    setTimeout(initWorld, 0);
}
