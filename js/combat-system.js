import { initializeFightUI } from './fight-ui.js';

class CombatSystem {
    constructor() {
        this.playerHealth = 100;
        this.witchHealth = 100;
        this.maxHealth = {
            player: 100,
            witch: 100
        };
        this.isInCombat = false;
        this.fightUI = null;
        this.potionUses = new Map();
    }

    async initialize() {
        this.fightUI = initializeFightUI();
        this.startCombat();
        return true;
    }

    startCombat() {
        this.isInCombat = true;
        this.updateUI();
        this.setupPotionHandlers();
    }

    setupPotionHandlers() {
        this.fightUI.updatePotions((potionName, potionData) => {
            // Get current uses of this potion
            const currentUses = this.potionUses.get(potionName) || 0;
            
            // Check if we still have uses available based on quantity
            if (currentUses < potionData.quantity) {
                this.handlePotionUse(potionName, potionData);
                // Increment the use counter
                this.potionUses.set(potionName, currentUses + 1);
                // Update UI to reflect remaining uses
                this.fightUI.updatePotionQuantity(potionName, potionData.quantity - (currentUses + 1));
            }
        });
    }

    handlePotionUse(potionName, potionData) {
        // Calculate damage
        let damage = this.calculatePotionDamage(potionName);
        this.witchHealth = Math.max(0, this.witchHealth - damage);
        this.fightUI.updateWitchHealth(this.witchHealth, this.maxHealth.witch);

        // Get witch model from global scope
        const witch = window.witch;
        if (witch) {
            // Apply completely different effects for each potion
            switch(potionName) {
                case "Brain Fryer":
                    // FLASH BANG + CRAZY SPIN
                    document.body.style.backgroundColor = 'white';
                    setTimeout(() => document.body.style.backgroundColor = '', 100);
                    
                    let spins = 0;
                    function spinCrazy() {
                        witch.rotation.x += 1;
                        witch.rotation.y += 1;
                        witch.rotation.z += 1;
                        spins++;
                        if (spins < 20) requestAnimationFrame(spinCrazy);
                        else {
                            witch.rotation.x = 0;
                            witch.rotation.z = 0;
                        }
                    }
                    requestAnimationFrame(spinCrazy);
                    break;

                case "Chain Reaction":
                    // EXPLOSION + SHAKE
                    const boom = document.createElement('div');
                    boom.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        width: 20px;
                        height: 20px;
                        background: orange;
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                        box-shadow: 0 0 50px red;
                        transition: all 0.5s;
                        z-index: 9999;
                    `;
                    document.body.appendChild(boom);
                    requestAnimationFrame(() => {
                        boom.style.transform = 'translate(-50%, -50%) scale(50)';
                        boom.style.opacity = '0';
                    });
                    setTimeout(() => boom.remove(), 500);

                    // Violent shake
                    const startPos = witch.position.clone();
                    let shakes = 0;
                    function shakeViolent() {
                        witch.position.x = startPos.x + (Math.random() - 0.5) * 3;
                        witch.position.y = startPos.y + (Math.random() - 0.5) * 3;
                        witch.position.z = startPos.z + (Math.random() - 0.5) * 3;
                        shakes++;
                        if (shakes < 30) requestAnimationFrame(shakeViolent);
                        else witch.position.copy(startPos);
                    }
                    requestAnimationFrame(shakeViolent);
                    break;

                case "Toxic Brew":
                    // SMOKE CLOUD
                    const smoke = document.createElement('div');
                    smoke.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        width: 100px;
                        height: 100px;
                        background: radial-gradient(circle, rgba(0,255,0,0.8), transparent);
                        transform: translate(-50%, -50%) scale(1);
                        transition: all 1s;
                        z-index: 9999;
                    `;
                    document.body.appendChild(smoke);
                    requestAnimationFrame(() => {
                        smoke.style.transform = 'translate(-50%, -50%) scale(20)';
                        smoke.style.opacity = '0';
                    });
                    setTimeout(() => smoke.remove(), 1000);

                    // Make witch cough
                    let coughs = 0;
                    function coughEffect() {
                        witch.position.y = Math.sin(coughs) * 0.5;
                        witch.rotation.x = Math.sin(coughs * 2) * 0.2;
                        coughs += 0.2;
                        if (coughs < Math.PI * 4) requestAnimationFrame(coughEffect);
                        else {
                            witch.position.y = 0;
                            witch.rotation.x = 0;
                        }
                    }
                    requestAnimationFrame(coughEffect);
                    break;

                case "Frost Blast":
                    // LIGHTNING STRIKE
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            const lightning = document.createElement('div');
                            lightning.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: ${40 + Math.random() * 20}%;
                                width: 5px;
                                height: 100%;
                                background: white;
                                transform: rotate(${(Math.random() - 0.5) * 20}deg);
                                z-index: 9999;
                            `;
                            document.body.appendChild(lightning);
                            setTimeout(() => lightning.remove(), 50);
                        }, i * 100);
                    }

                    // Make witch get electrocuted
                    let zaps = 0;
                    function zapEffect() {
                        witch.position.x = (Math.random() - 0.5) * 1;
                        witch.position.y = (Math.random() - 0.5) * 1;
                        witch.position.z = (Math.random() - 0.5) * 1;
                        zaps++;
                        if (zaps < 20) requestAnimationFrame(zapEffect);
                        else {
                            witch.position.set(0, 0, 0);
                        }
                    }
                    requestAnimationFrame(zapEffect);
                    break;

                case "Fire Storm":
                    // TORNADO SPIN
                    let spinCount = 0;
                    function tornadoSpin() {
                        witch.rotation.y += 0.5;
                        witch.position.y = Math.sin(spinCount * 0.2) * 2;
                        spinCount++;
                        if (spinCount < 30) requestAnimationFrame(tornadoSpin);
                        else witch.position.y = 0;
                    }
                    requestAnimationFrame(tornadoSpin);
                    break;
            }
        }

        // Check if witch is defeated
        if (this.witchHealth <= 0) {
            this.endCombat(true);
        } else {
            // Witch counter-attack if still alive
            setTimeout(() => this.witchCounterAttack(), 1500);
        }
    }

    calculatePotionDamage(potionName) {
        const damageRanges = {
            "Brain Fryer": [30, 45],
            "Chain Reaction": [35, 50],
            "Toxic Brew": [25, 40],
            "Frost Blast": [20, 35],
            "Fire Storm": [40, 60],
            "default": [15, 25]
        };

        const [min, max] = damageRanges[potionName] || damageRanges.default;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    witchCounterAttack() {
        // Calculate witch damage
        let damage = Math.floor(Math.random() * 20) + 15;
        
        // Increase damage when witch is low on health
        if (this.witchHealth < this.maxHealth.witch * 0.3) {
            damage *= 1.5;
        }

        this.playerHealth = Math.max(0, this.playerHealth - damage);
        this.fightUI.updateHealth(this.playerHealth, this.maxHealth.player);

        if (this.playerHealth === 0) {
            this.endCombat(false);
        }
    }

    showGameOverScreen() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: #d4af37;
            font-family: 'MedievalSharp', cursive;
        `;

        const gameOverText = document.createElement('h1');
        gameOverText.style.cssText = `
            font-size: 72px;
            margin-bottom: 30px;
            text-shadow: 0 0 20px #d4af37;
            animation: pulse 2s infinite;
        `;
        gameOverText.textContent = 'Game Over';

        const retryButton = document.createElement('button');
        retryButton.style.cssText = `
            padding: 15px 30px;
            font-size: 24px;
            background: linear-gradient(45deg, #4a0066, #8800cc);
            border: 3px solid #8b4513;
            color: #d4af37;
            cursor: pointer;
            font-family: 'MedievalSharp', cursive;
            border-radius: 10px;
            transition: all 0.3s ease;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
        `;
        retryButton.textContent = 'Try Again';
        retryButton.addEventListener('mouseover', () => {
            retryButton.style.transform = 'scale(1.1)';
            retryButton.style.boxShadow = '0 0 20px #d4af37';
        });
        retryButton.addEventListener('mouseout', () => {
            retryButton.style.transform = 'scale(1)';
            retryButton.style.boxShadow = 'none';
        });
        retryButton.addEventListener('click', () => {
            // Reset inventory and budget in localStorage
            localStorage.setItem('potionInventory', '[]');
            localStorage.setItem('budget', '100');
            // Redirect to index.html
            window.location.href = 'index.html';
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        gameOverScreen.appendChild(gameOverText);
        gameOverScreen.appendChild(retryButton);
        document.body.appendChild(gameOverScreen);
    }

    showVictoryScreen() {
        const victoryScreen = document.createElement('div');
        victoryScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: #d4af37;
            font-family: 'MedievalSharp', cursive;
        `;

        const victoryText = document.createElement('h1');
        victoryText.style.cssText = `
            font-size: 72px;
            margin-bottom: 30px;
            text-shadow: 0 0 20px #d4af37;
            animation: victoryPulse 2s infinite;
            color: #ffd700;
        `;
        victoryText.textContent = 'Victory!';

        const subText = document.createElement('h2');
        subText.style.cssText = `
            font-size: 32px;
            margin-bottom: 30px;
            color: #ffd700;
            text-shadow: 0 0 10px #ffd700;
        `;
        subText.textContent = 'You defeated the Dark Witch!';

        const continueButton = document.createElement('button');
        continueButton.style.cssText = `
            padding: 15px 30px;
            font-size: 24px;
            background: linear-gradient(45deg, #ffd700, #daa520);
            border: 3px solid #8b4513;
            color: #000;
            cursor: pointer;
            font-family: 'MedievalSharp', cursive;
            border-radius: 10px;
            transition: all 0.3s ease;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            font-weight: bold;
        `;
        continueButton.textContent = 'Continue Adventure';
        continueButton.addEventListener('mouseover', () => {
            continueButton.style.transform = 'scale(1.1)';
            continueButton.style.boxShadow = '0 0 20px #ffd700';
        });
        continueButton.addEventListener('mouseout', () => {
            continueButton.style.transform = 'scale(1)';
            continueButton.style.boxShadow = 'none';
        });
        continueButton.addEventListener('click', () => {
            // Add victory bonus to budget
            const currentBudget = parseInt(localStorage.getItem('budget') || '100');
            localStorage.setItem('budget', (currentBudget + 500).toString());
            // Redirect to index.html
            window.location.href = 'index.html';
        });

        // Create victory particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: #ffd700;
                border-radius: 50%;
                pointer-events: none;
                animation: particle ${Math.random() * 2 + 1}s linear infinite;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
            `;
            victoryScreen.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes victoryPulse {
                0% { transform: scale(1); text-shadow: 0 0 20px #ffd700; }
                50% { transform: scale(1.1); text-shadow: 0 0 40px #ffd700; }
                100% { transform: scale(1); text-shadow: 0 0 20px #ffd700; }
            }
            @keyframes particle {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        victoryScreen.appendChild(victoryText);
        victoryScreen.appendChild(subText);
        victoryScreen.appendChild(continueButton);
        document.body.appendChild(victoryScreen);
    }

    endCombat(playerWon) {
        this.isInCombat = false;
        // Reset witch effects
        const witch = window.witch;
        if (witch) {
            witch.rotation.y = 0;
            witch.position.y = 0;
            witch.scale.set(1, 1, 1);
            if (witch.material) {
                witch.material.color.setHex(0xffffff);
                witch.material.opacity = 1;
            }
        }

        if (playerWon) {
            this.showVictoryScreen();
        } else {
            this.showGameOverScreen();
        }
    }

    updateUI() {
        this.fightUI.updateHealth(this.playerHealth, this.maxHealth.player);
        this.fightUI.updateWitchHealth(this.witchHealth, this.maxHealth.witch);
    }
}

export const combatSystem = new CombatSystem();
