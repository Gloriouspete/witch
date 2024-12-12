import * as THREE from 'three';

// Create a money pickup mesh
function createMoneyPickup(amount) {
    const group = new THREE.Group();
    group.userData.isMoneyPickup = true;
    group.userData.amount = amount;

    // Create dollar bill stack
    const billGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.2);
    const billMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        metalness: 0.1,
        roughness: 0.8,
        emissive: 0x00aa00,
        emissiveIntensity: 0.2
    });

    // Stack multiple bills with slight offset
    const numBills = Math.min(5, Math.max(1, Math.floor(amount / 5)));
    for (let i = 0; i < numBills; i++) {
        const bill = new THREE.Mesh(billGeometry, billMaterial);
        bill.position.y = i * 0.005;
        // Slight random rotation and offset for each bill
        bill.rotation.y = Math.random() * 0.2 - 0.1;
        bill.position.x += (Math.random() - 0.5) * 0.05;
        bill.position.z += (Math.random() - 0.5) * 0.05;
        group.add(bill);
    }

    // Add dollar sign
    const dollarSignGeometry = new THREE.PlaneGeometry(0.15, 0.15);
    const dollarSignMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const dollarSign = new THREE.Mesh(dollarSignGeometry, dollarSignMaterial);
    dollarSign.position.y = numBills * 0.005 + 0.1;
    dollarSign.rotation.x = -Math.PI / 2;
    group.add(dollarSign);

    // Add subtle glow effect
    const glowGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.3);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.multiplyScalar(1.2);
    group.add(glow);

    // Add floating animation
    const startY = group.position.y;
    const animate = () => {
        const time = Date.now() * 0.001;
        group.position.y = startY + Math.sin(time * 2) * 0.1;
        group.rotation.y += 0.01;
        requestAnimationFrame(animate);
    };
    animate();

    return group;
}

// Spawn money pickups in random positions around the forest
export function spawnMoneyPickups(scene, forestRadius = 40, numPickups = 8) {
    const pickups = [];

    for (let i = 0; i < numPickups; i++) {
        // Random position within forest radius
        const angle = Math.random() * Math.PI * 2;
        const radius = 15 + Math.random() * forestRadius; // Keep away from center
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Random amount between 1 and 50
        const amount = Math.floor(Math.random() * 50) + 1;
        
        const pickup = createMoneyPickup(amount);
        pickup.position.set(x, 0.5, z); // Position slightly above ground
        scene.add(pickup);
        pickups.push(pickup);
    }

    return pickups;
}

// Handle clicking on money pickups
export function setupMoneyPickupHandler(camera, scene) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (const intersect of intersects) {
            let obj = intersect.object;
            // Find the parent group that has the money pickup data
            while (obj.parent && !obj.userData.isMoneyPickup) {
                obj = obj.parent;
            }

            if (obj.userData.isMoneyPickup) {
                const amount = obj.userData.amount;
                
                // Create floating text effect
                const text = document.createElement('div');
                text.textContent = `+$${amount}`;
                text.style.cssText = `
                    position: fixed;
                    color: #00ff00;
                    font-family: 'MedievalSharp', cursive;
                    font-size: 20px;
                    pointer-events: none;
                    text-shadow: 0 0 10px #00ff00;
                    z-index: 1000;
                    left: ${event.clientX}px;
                    top: ${event.clientY}px;
                    transition: all 1s ease-out;
                `;
                document.body.appendChild(text);

                // Animate text floating up
                setTimeout(() => {
                    text.style.transform = 'translateY(-50px)';
                    text.style.opacity = '0';
                }, 0);
                setTimeout(() => {
                    document.body.removeChild(text);
                }, 1000);

                // Update budget
                const savedBudget = localStorage.getItem('witchBudget') || '250';
                const currentBudget = parseInt(savedBudget);
                const newBudget = currentBudget + amount;
                localStorage.setItem('witchBudget', newBudget.toString());

                // Update budget display if it exists
                const budgetDisplay = document.getElementById('budget-display');
                if (budgetDisplay) {
                    budgetDisplay.textContent = `Budget: $${newBudget}`;
                }

                // Remove the pickup from scene
                scene.remove(obj);
                break;
            }
        }
    });
}
