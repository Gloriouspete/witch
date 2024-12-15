import { setupScene, setupLighting, createTerrain, createPath, createForestBackground } from './scene.js';
import { setupClickHandler } from './click-handler.js';
import { createWitchHouse, createVillageHouse, createAlchemyBuilding } from './objects/buildings.js';
import { createExperimentBuilding } from './objects/experiment.js';
import { createForest } from './objects/tree.js';
import { spawnMoneyPickups, setupMoneyPickupHandler } from './money-spawns.js';

// export function initWorld() {
//     try {
//         // Setup scene, camera, renderer, and controls
//         const { scene, camera, renderer, controls } = setupScene();

//         // Setup lighting and environment
//         setupLighting(scene);
//         scene.add(createTerrain());
//         createForestBackground(scene);

//         // Add path and get path points
//         const { pathGroup, pathPoints } = createPath();
//         scene.add(pathGroup);

//         // Add witch's house at the center
//         const witchHouse = createWitchHouse();
//         witchHouse.position.set(0, 0, 0);
//         witchHouse.rotation.y = Math.PI / 4;
//         scene.add(witchHouse);

//         // Add alchemy building
//         const alchemyBuilding = createAlchemyBuilding();
//         alchemyBuilding.position.set(-15, 0, 15);
//         alchemyBuilding.rotation.y = Math.PI / 6;
//         alchemyBuilding.userData.isAlchemyBuilding = true;  // Add flag for click handler
//         scene.add(alchemyBuilding);

//         // Add experiment building
//         const experimentBuilding = createExperimentBuilding();
//         experimentBuilding.position.set(18, 0, -5);
//         experimentBuilding.rotation.y = 0;
//         scene.add(experimentBuilding);

//         // Make scene globally accessible for click handler
//         window.scene = scene;

//         // Setup click handler for witch's house
//         setupClickHandler(camera, renderer, witchHouse);

//         // Add small village houses along the path
//         const numHouses = 5;
//         for (let i = 1; i <= numHouses; i++) {
//             const pathIndex = Math.floor((i / (numHouses + 1)) * pathPoints.length);
//             const point = pathPoints[pathIndex];

//             const house = createVillageHouse();

//             const offset = (i % 2 === 0 ? 1 : -1) * (5 + Math.random() * 2);
//             const angle = Math.atan2(
//                 pathPoints[pathIndex + 1]?.z - point.z,
//                 pathPoints[pathIndex + 1]?.x - point.x
//             );

//             house.position.set(
//                 point.x + Math.cos(angle + Math.PI/2) * offset,
//                 0,
//                 point.z + Math.sin(angle + Math.PI/2) * offset
//             );

//             house.lookAt(point.x, 0, point.z);
//             house.rotation.y += Math.PI/2;
//             house.rotation.y += (Math.random() - 0.5) * 0.2;

//             scene.add(house);

//             const houseForest = createForest(
//                 house.position.x + (Math.random() - 0.5) * 5,
//                 house.position.z + (Math.random() - 0.5) * 5,
//                 4
//             );
//             scene.add(houseForest);
//         }

//         // Spawn money pickups in the forest
//         spawnMoneyPickups(scene);
//         setupMoneyPickupHandler(camera, scene);

//         // Animation loop
//         function animate() {
//             requestAnimationFrame(animate);
//             controls.update();
//             renderer.render(scene, camera);
//         }

//         window.addEventListener('resize', () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(window.innerWidth, window.innerHeight);
//         });

//         animate();
//     } catch (error) {
//         document.getElementById('error').textContent = error.toString();
//         console.error(error);
//     }
// }

export async function initWorld() {
    try {
        // Setup scene, camera, renderer, and controls
        const { scene, camera, renderer, controls } = setupScene();

        // Setup lighting and environment
        setupLighting(scene);
        setTimeout(() => {
            scene.add(createTerrain());
        }, 1000);

        // Optimize background creation: only create once or reduce complexity
        createForestBackground(scene);

        // Add path and get path points
        const { pathGroup, pathPoints } = createPath();
        scene.add(pathGroup);

        // Add witch's house at the center
        setTimeout(() => {

        }, 1000);
        let witchHouse;
        setTimeout(() => {
            witchHouse = createWitchHouse();
            witchHouse.position.set(0, 0, 0);
            witchHouse.rotation.y = Math.PI / 4;
            scene.add(witchHouse);
        }, 1000);


        // Add alchemy building
        const alchemyBuilding = createAlchemyBuilding();
        alchemyBuilding.position.set(-15, 0, 15);
        alchemyBuilding.rotation.y = Math.PI / 6;
        alchemyBuilding.userData.isAlchemyBuilding = true; // Add flag for click handler
        scene.add(alchemyBuilding);

        setTimeout(() => {
            const experimentBuilding = createExperimentBuilding();
            experimentBuilding.position.set(18, 0, -5);
            experimentBuilding.rotation.y = 0;
            scene.add(experimentBuilding);

        }, 1000);
        //Add experiment building

        // Make scene globally accessible for click handler
        window.scene = scene;

        // Setup click handler for witch's house
        setupClickHandler(camera, renderer, witchHouse);

        // Add small village houses along the path with reduced complexity
        const numHouses = 5;
        for (let i = 1; i <= numHouses; i++) {
            const pathIndex = Math.floor((i / (numHouses + 1)) * pathPoints.length);
            const point = pathPoints[pathIndex];

            const house = createVillageHouse();

            // Use a smaller offset for better performance and realism
            const offset = (i % 2 === 0 ? 1 : -1) * (3 + Math.random() * 1.5);
            const angle = Math.atan2(
                pathPoints[pathIndex + 1]?.z - point.z,
                pathPoints[pathIndex + 1]?.x - point.x
            );

            house.position.set(
                point.x + Math.cos(angle + Math.PI / 2) * offset,
                0,
                point.z + Math.sin(angle + Math.PI / 2) * offset
            );

            house.lookAt(point.x, 0, point.z);
            house.rotation.y += Math.PI / 2;
            house.rotation.y += (Math.random() - 0.5) * 0.1;  // Slightly reduce randomness

            scene.add(house);

            // Create less dense forest around houses
            const houseForest = createForest(
                house.position.x + (Math.random() - 0.5) * 3,
                house.position.z + (Math.random() - 0.5) * 3,
                2 // Reduced tree count for optimization
            );
            scene.add(houseForest);
        }

        // Spawn fewer money pickups to reduce object count
        spawnMoneyPickups(scene, 10);  // Limit the number of pickups

        // Optimized animation loop with frame rate cap
        let lastFrameTime = 0;
        const maxFPS = 30;  // Cap frame rate to 30 FPS for less demanding devices
        function animate(time) {
            requestAnimationFrame(animate);
            const deltaTime = time - lastFrameTime;
            if (deltaTime < 1000 / maxFPS) return;  // Skip frame if the time is too short

            controls.update();
            renderer.render(scene, camera);
            lastFrameTime = time;
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate(0);
    } catch (error) {
        document.getElementById('error').textContent = error.toString();
        console.error(error);
    }
    function cleanUp() {
        // Dispose of all objects
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
                scene.remove(object);
            }
        });

        // Dispose of lights
        scene.lights.forEach(light => disposeLight(light));
    }
}
