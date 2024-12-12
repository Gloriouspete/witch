// Reuse style element for all effects
const effectStyles = document.createElement('style');
effectStyles.textContent = `
    @keyframes flash {
        0% { opacity: 0.5; }
        100% { opacity: 0; }
    }
    @keyframes smoke {
        0% { transform: scale(0); opacity: 0.4; }
        100% { transform: scale(2); opacity: 0; }
    }
    .effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1500;
    }
`;
document.head.appendChild(effectStyles);

// Create screen effect with simplified animations
function createScreenEffect(type, color) {
    const effect = document.createElement('div');
    effect.className = 'effect';

    // Simplified effects - only use basic animations
    switch(type) {
        case "flash":
        case "matrix":
            effect.style.background = color;
            effect.style.animation = "flash 0.3s ease-out forwards";
            break;
        case "smoke":
        case "vortex":
        case "shockwave":
            effect.style.background = `radial-gradient(circle at 50% 50%, ${color}, transparent)`;
            effect.style.animation = "smoke 1s ease-out forwards";
            break;
    }

    document.body.appendChild(effect);

    // Remove after animation
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// Simplified potion throw animation
export function animatePotionThrow(startX, startY, color, potionName) {
    return new Promise((resolve) => {
        const potion = document.createElement('div');
        potion.style.cssText = `
            position: fixed;
            width: 20px;
            height: 40px;
            background: ${color};
            border-radius: 25%;
            z-index: 1500;
            left: ${startX}px;
            top: ${startY}px;
        `;

        document.body.appendChild(potion);

        // Get witch position
        const witch = window.witch;
        const camera = window.camera;
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(witch.matrixWorld);
        vector.project(camera);
        
        const endX = (vector.x + 1) * window.innerWidth / 2;
        const endY = (-vector.y + 1) * window.innerHeight / 2;

        const duration = 500; // Reduced duration
        const startTime = performance.now();
        let animationFrame;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Simplified trajectory
            const x = startX + (endX - startX) * progress;
            const y = startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * 100;

            potion.style.left = `${x}px`;
            potion.style.top = `${y}px`;
            potion.style.transform = `rotate(${progress * 360}deg)`; // Reduced rotation

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrame);
                createScreenEffect(
                    ["flash", "smoke"][Math.floor(Math.random() * 2)], // Randomize between two basic effects
                    color
                );
                applyWitchEffect("shake"); // Use only shake effect for simplicity
                potion.remove();
                resolve();
            }
        }

        animationFrame = requestAnimationFrame(animate);
    });
}

// Simplified witch effects using a single animation system
let currentWitchAnimation = null;

export function applyWitchEffect(type) {
    const witch = window.witch;
    if (!witch || currentWitchAnimation) return;

    const startPos = {
        x: witch.position.x,
        y: witch.position.y,
        z: witch.position.z,
        rotY: witch.rotation.y
    };

    const duration = 500; // Reduced duration
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Simple shake effect
        if (progress < 1) {
            witch.position.x = startPos.x + (Math.random() - 0.5) * 0.2;
            witch.position.z = startPos.z + (Math.random() - 0.5) * 0.2;
            currentWitchAnimation = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(currentWitchAnimation);
            currentWitchAnimation = null;
            // Reset position
            witch.position.x = startPos.x;
            witch.position.z = startPos.z;
        }
    }

    currentWitchAnimation = requestAnimationFrame(animate);
}
