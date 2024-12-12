// Special effects for potions when they hit the witch
export const potionEffects = {
    "Brain Fryer": {
        screenEffect: () => {
            // Nuclear flash effect
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.backgroundColor = 'white';
            flash.style.zIndex = '9999';
            document.body.appendChild(flash);
            
            // Strobe effect
            let flashes = 0;
            const strobeInterval = setInterval(() => {
                flash.style.opacity = flashes % 2 ? '1' : '0';
                flashes++;
                if (flashes > 6) {
                    clearInterval(strobeInterval);
                    flash.remove();
                }
            }, 100);
        },
        witchEffect: (witch) => {
            // Make witch spaz out
            let spazCount = 0;
            const originalRotation = witch.rotation.clone();
            
            function spaz() {
                witch.rotation.x = originalRotation.x + (Math.random() - 0.5) * 2;
                witch.rotation.y = originalRotation.y + (Math.random() - 0.5) * 2;
                witch.rotation.z = originalRotation.z + (Math.random() - 0.5) * 2;
                witch.position.y += Math.sin(spazCount) * 0.2;
                
                spazCount++;
                if (spazCount < 30) {
                    requestAnimationFrame(spaz);
                } else {
                    witch.rotation.copy(originalRotation);
                    witch.position.y = 0;
                }
            }
            requestAnimationFrame(spaz);
        }
    },

    "Chain Reaction": {
        screenEffect: () => {
            // Multiple explosion rings
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const ring = document.createElement('div');
                    ring.style.cssText = `
                        position: fixed;
                        top: ${Math.random() * 100}%;
                        left: ${Math.random() * 100}%;
                        width: 50px;
                        height: 50px;
                        border: 5px solid yellow;
                        border-radius: 50%;
                        transform: scale(0);
                        transition: transform 0.5s, opacity 0.5s;
                        opacity: 1;
                        z-index: 9999;
                    `;
                    document.body.appendChild(ring);
                    
                    requestAnimationFrame(() => {
                        ring.style.transform = 'scale(20)';
                        ring.style.opacity = '0';
                    });
                    
                    setTimeout(() => ring.remove(), 500);
                }, i * 200);
            }
        },
        witchEffect: (witch) => {
            // Make witch bounce violently
            const originalPos = witch.position.clone();
            let bounceCount = 0;
            
            function bounce() {
                witch.position.x = originalPos.x + (Math.random() - 0.5) * 3;
                witch.position.y = originalPos.y + Math.abs(Math.sin(bounceCount * 0.5)) * 3;
                witch.position.z = originalPos.z + (Math.random() - 0.5) * 3;
                
                bounceCount++;
                if (bounceCount < 30) {
                    requestAnimationFrame(bounce);
                } else {
                    witch.position.copy(originalPos);
                }
            }
            requestAnimationFrame(bounce);
        }
    },

    "Toxic Brew": {
        screenEffect: () => {
            // Matrix-style toxic effect
            document.body.style.transition = 'filter 0.5s';
            document.body.style.filter = 'hue-rotate(90deg) brightness(150%) contrast(150%)';
            
            const matrix = document.createElement('div');
            matrix.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 200%;
                background: repeating-linear-gradient(
                    0deg,
                    rgba(0, 255, 0, 0.2) 0px,
                    transparent 2px,
                    transparent 4px
                );
                z-index: 9999;
                animation: matrix-fall 2s linear;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes matrix-fall {
                    from { transform: translateY(-50%); }
                    to { transform: translateY(0); }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(matrix);
            
            setTimeout(() => {
                document.body.style.filter = '';
                matrix.remove();
                style.remove();
            }, 2000);
        },
        witchEffect: (witch) => {
            // Make witch melt and reform
            const originalScale = witch.scale.clone();
            let meltCount = 0;
            
            function melt() {
                const wave = Math.sin(meltCount * 0.1);
                witch.scale.y = Math.max(0.1, originalScale.y - wave);
                witch.scale.x = originalScale.x + wave * 0.5;
                witch.scale.z = originalScale.z + wave * 0.5;
                
                meltCount++;
                if (meltCount < 50) {
                    requestAnimationFrame(melt);
                } else {
                    witch.scale.copy(originalScale);
                }
            }
            requestAnimationFrame(melt);
        }
    },

    "Frost Blast": {
        screenEffect: () => {
            // Freeze effect with ice crystals
            document.body.style.transition = 'filter 0.5s';
            document.body.style.filter = 'brightness(150%) saturate(50%) blur(2px)';
            
            // Add ice crystals
            for (let i = 0; i < 10; i++) {
                const crystal = document.createElement('div');
                crystal.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    width: 20px;
                    height: 40px;
                    background: rgba(135, 206, 235, 0.5);
                    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                    transform: scale(0) rotate(${Math.random() * 360}deg);
                    transition: transform 1s;
                    z-index: 9999;
                `;
                document.body.appendChild(crystal);
                
                requestAnimationFrame(() => {
                    crystal.style.transform = `scale(${1 + Math.random() * 2}) rotate(${Math.random() * 360}deg)`;
                });
                
                setTimeout(() => crystal.remove(), 2000);
            }
            
            setTimeout(() => {
                document.body.style.filter = '';
            }, 2000);
        },
        witchEffect: (witch) => {
            // Freeze witch in crystal
            const originalScale = witch.scale.clone();
            witch.scale.set(1.5, 1.5, 1.5);
            
            let crystalCount = 0;
            function crystallize() {
                witch.rotation.y = Math.sin(crystalCount * 0.1) * Math.PI / 8;
                
                crystalCount++;
                if (crystalCount < 40) {
                    requestAnimationFrame(crystallize);
                } else {
                    witch.scale.copy(originalScale);
                    witch.rotation.y = 0;
                }
            }
            requestAnimationFrame(crystallize);
        }
    },

    "Fire Storm": {
        screenEffect: () => {
            // Fire vortex effect
            const vortex = document.createElement('div');
            vortex.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 200vmax;
                height: 200vmax;
                background: conic-gradient(
                    from 0deg at 50% 50%,
                    transparent,
                    rgba(255, 0, 0, 0.8),
                    rgba(255, 128, 0, 0.8),
                    transparent
                );
                transform: translate(-50%, -50%) scale(0) rotate(0deg);
                transition: transform 2s;
                z-index: 9999;
                mix-blend-mode: screen;
            `;
            document.body.appendChild(vortex);
            
            requestAnimationFrame(() => {
                vortex.style.transform = 'translate(-50%, -50%) scale(1) rotate(720deg)';
                vortex.style.opacity = '0';
            });
            
            setTimeout(() => vortex.remove(), 2000);
        },
        witchEffect: (witch) => {
            // Make witch spin into a fiery tornado
            const originalScale = witch.scale.clone();
            let spinCount = 0;
            
            function spinTornado() {
                witch.rotation.y += 0.3;
                const wave = Math.sin(spinCount * 0.2);
                witch.scale.set(
                    originalScale.x * (1 + wave * 0.5),
                    originalScale.y * (2 - Math.abs(wave)),
                    originalScale.z * (1 + wave * 0.5)
                );
                
                spinCount++;
                if (spinCount < 40) {
                    requestAnimationFrame(spinTornado);
                } else {
                    witch.scale.copy(originalScale);
                }
            }
            requestAnimationFrame(spinTornado);
        }
    }
};

// Helper function to apply both effects
export function applyPotionEffects(potionName, witch) {
    const effect = potionEffects[potionName];
    if (effect) {
        effect.screenEffect();
        effect.witchEffect(witch);
    }
}
