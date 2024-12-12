export let controls;

export function initControls(camera, domElement) {
    controls = new THREE.OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 20; // Set to a good default viewing distance
    controls.maxDistance = 20; // Same as minDistance to lock zoom
    controls.enableZoom = false; // Explicitly disable zoom
    controls.enablePan = false; // Disable panning
    return controls;
}
