import { getPotionInventory } from './inventory-system.js';
import { animatePotionThrow, applyWitchEffect } from './potion-animations.js';

// Create fight prompt dialog
function createFightPrompt(enemyName) {
    return Promise.resolve(true); // Skip the prompt since we already have one in dungeon.js
}

// Create health bar
function createHealthBar(isWitch = false) {
    const healthBarContainer = document.createElement('div');
    healthBarContainer.id = isWitch ? 'witch-health-bar-container' : 'health-bar-container';
    healthBarContainer.style.cssText = `
        position: fixed;
        ${isWitch ? 'top: 20px' : 'bottom: 20px'};
        ${isWitch ? 'right: 20px' : 'left: 20px'};
        width: 200px;
        height: 30px;
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        border: 3px solid #8b4513;
        border-radius: 15px;
        padding: 3px;
        z-index: 9999;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    `;

    const healthBar = document.createElement('div');
    healthBar.id = isWitch ? 'witch-health-bar' : 'health-bar';
    healthBar.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, ${isWitch ? '#800080, #4B0082' : '#ff0000, #ff3333'});
        border-radius: 10px;
        transition: width 0.3s ease;
    `;

    const healthText = document.createElement('div');
    healthText.id = isWitch ? 'witch-health-text' : 'health-text';
    healthText.style.cssText = `
        position: absolute;
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-family: 'MedievalSharp', cursive;
        font-size: 14px;
        line-height: 24px;
        text-shadow: 1px 1px 2px #000000;
        z-index: 10000;
    `;
    healthText.textContent = '100/100';

    const label = document.createElement('div');
    label.style.cssText = `
        position: absolute;
        ${isWitch ? 'bottom: -25px' : 'top: -25px'};
        left: 50%;
        transform: translateX(-50%);
        color: #d4af37;
        font-family: 'MedievalSharp', cursive;
        font-size: 16px;
        text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
        white-space: nowrap;
        z-index: 10000;
    `;
    label.textContent = isWitch ? '🧙‍♀️ Dark Witch' : '🧪 Player';

    healthBarContainer.appendChild(healthBar);
    healthBarContainer.appendChild(healthText);
    healthBarContainer.appendChild(label);
    document.body.appendChild(healthBarContainer);

    return {
        setHealth: (current, max) => {
            const percentage = (current / max) * 100;
            healthBar.style.width = `${percentage}%`;
            healthText.textContent = `${current}/${max}`;
        }
    };
}

// Create use potion confirmation dialog
function createUsePotionDialog(potionName, remainingUses) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2001;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: linear-gradient(45deg, #1a0f0a, #2a1810);
            border: 3px solid #8b4513;
            padding: 20px;
            text-align: center;
            color: #d4af37;
            font-family: 'MedievalSharp', cursive;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(139, 69, 19, 0.5);
        `;

        dialog.innerHTML = `
            <h3 style="margin-bottom: 15px;">Use ${potionName}?</h3>
            <p style="margin-bottom: 15px; font-size: 14px;">(${remainingUses} uses remaining)</p>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button id="confirm-use" style="
                    padding: 8px 20px;
                    background: linear-gradient(45deg, #4a0066, #8800cc);
                    border: 2px solid #8b4513;
                    color: #d4af37;
                    cursor: pointer;
                    font-family: 'MedievalSharp', cursive;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                ">Yes</button>
                <button id="cancel-use" style="
                    padding: 8px 20px;
                    background: linear-gradient(45deg, #2a1810, #1a0f0a);
                    border: 2px solid #8b4513;
                    color: #d4af37;
                    cursor: pointer;
                    font-family: 'MedievalSharp', cursive;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                ">No</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const confirmBtn = dialog.querySelector('#confirm-use');
        const cancelBtn = dialog.querySelector('#cancel-use');

        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                e.stopPropagation();
            }
        });
    });
}

// Create screen effects
function createScreenEffect(type, color) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1500;
    `;

    switch(type) {
        case "flash":
            effect.style.background = color;
            effect.style.animation = "flash 0.5s ease-out forwards";
            break;
        case "smoke":
            effect.style.background = `radial-gradient(circle at 50% 50%, ${color}, transparent)`;
            effect.style.animation = "smoke 2s ease-out forwards";
            break;
        case "vortex":
            effect.style.background = `conic-gradient(from 0deg at 50% 50%, ${color}, transparent)`;
            effect.style.animation = "vortex 1.5s linear forwards";
            break;
        case "shockwave":
            effect.style.border = `2px solid ${color}`;
            effect.style.animation = "shockwave 1s ease-out forwards";
            break;
        case "matrix":
            effect.style.background = `linear-gradient(${color}, transparent)`;
            effect.style.animation = "matrix 2s ease-out forwards";
            break;
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes flash {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        @keyframes smoke {
            0% { transform: scale(0); opacity: 0.8; }
            100% { transform: scale(4); opacity: 0; }
        }
        @keyframes vortex {
            0% { transform: scale(0) rotate(0deg); opacity: 0.8; }
            100% { transform: scale(2) rotate(720deg); opacity: 0; }
        }
        @keyframes shockwave {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
        }
        @keyframes matrix {
            0% { transform: translateY(-100%); opacity: 0.8; }
            100% { transform: translateY(100%); opacity: 0; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(effect);

    // Remove after animation
    setTimeout(() => {
        effect.remove();
        style.remove();
    }, 2000);
}

// Create and append the bottom potion bar
function createPotionBar() {
    const potionBar = document.createElement('div');
    potionBar.id = 'potion-bar';
    potionBar.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        border: 3px solid #8b4513;
        border-radius: 15px;
        padding: 15px;
        display: flex;
        gap: 15px;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    `;

    const label = document.createElement('div');
    label.style.cssText = `
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        color: #d4af37;
        font-family: 'MedievalSharp', cursive;
        font-size: 16px;
        text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        padding: 3px 15px;
        border: 2px solid #8b4513;
        border-radius: 10px;
        white-space: nowrap;
    `;
    label.textContent = '🧪 Your Potions';
    potionBar.appendChild(label);

    document.body.appendChild(potionBar);
    return potionBar;
}

// Create potion slot
function createPotionSlot(name, data, onPotionUse) {
    const potion = document.createElement('div');
    potion.className = 'potion-slot';
    potion.id = `potion-${name.toLowerCase().replace(/\s+/g, '-')}`;
    potion.style.cssText = `
        width: 50px;
        height: 90px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(26, 15, 10, 0.6);
        border-radius: 12px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${data.color};
    `;

    const bottle = document.createElement('div');
    bottle.style.cssText = `
        width: 40px;
        height: 70px;
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 35% 35% 30% 30%;
        border: 2px solid ${data.color};
        overflow: hidden;
    `;

    const liquid = document.createElement('div');
    liquid.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80%;
        background: ${data.color};
        filter: brightness(1.5);
        box-shadow: 0 0 20px ${data.color};
        border-radius: 30% 30% 20% 20%;
    `;

    const cork = document.createElement('div');
    cork.style.cssText = `
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 8px;
        background: #2a1810;
        border: 2px solid ${data.color};
        border-radius: 5px;
    `;

    const quantity = document.createElement('div');
    quantity.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: ${data.color};
        color: #000;
        font-family: 'MedievalSharp', cursive;
        font-size: 14px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #8b4513;
        box-shadow: 0 0 10px ${data.color};
    `;
    quantity.textContent = data.quantity;

    bottle.appendChild(liquid);
    bottle.appendChild(cork);
    potion.appendChild(bottle);
    potion.appendChild(quantity);

    potion.addEventListener('click', async () => {
        if (data.quantity > 0) {
            const usePotion = await createUsePotionDialog(name, data.quantity);
            if (usePotion) {
                const rect = potion.getBoundingClientRect();
                const startX = rect.left + rect.width / 2;
                const startY = rect.top + rect.height / 2;

                await animatePotionThrow(startX, startY, data.color, name);
                if (onPotionUse) {
                    onPotionUse(name, data);
                }
            }
        }
    });

    potion.addEventListener('mouseover', () => {
        potion.style.transform = 'scale(1.15) translateY(-5px)';
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(26, 15, 10, 0.95);
            border: 2px solid ${data.color};
            padding: 8px 12px;
            border-radius: 8px;
            color: #d4af37;
            font-size: 14px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1001;
            font-family: 'MedievalSharp', cursive;
            min-width: 150px;
            text-align: center;
            box-shadow: 0 0 15px ${data.color};
        `;
        tooltip.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 5px; color: ${data.color};">
                ${name}
            </div>
            <div style="font-style: italic; font-size: 12px;">
                ${data.effect}
            </div>
            <div style="font-size: 12px; margin-top: 5px;">
                ${data.quantity} uses remaining
            </div>
        `;
        potion.appendChild(tooltip);
    });

    potion.addEventListener('mouseout', () => {
        potion.style.transform = 'scale(1) translateY(0)';
        const tooltip = potion.querySelector('div[style*="position: absolute"][style*="bottom: 120%"]');
        if (tooltip) tooltip.remove();
    });

    return potion;
}

// Update potion bar with current inventory
function updatePotionBar(potionBar, onPotionUse) {
    // Use actual potion inventory
    const potionInventory = getPotionInventory();
    potionBar.innerHTML = '';

    // Re-add the label
    const label = document.createElement('div');
    label.style.cssText = `
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        color: #d4af37;
        font-family: 'MedievalSharp', cursive;
        font-size: 16px;
        text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        padding: 3px 15px;
        border: 2px solid #8b4513;
        border-radius: 10px;
        white-space: nowrap;
    `;
    label.textContent = '🧪 Your Potions';
    potionBar.appendChild(label);

    // Add potion slots
    for (const [name, data] of potionInventory) {
        if (data.quantity > 0) {
            const potionSlot = createPotionSlot(name, data, onPotionUse);
            potionBar.appendChild(potionSlot);
        }
    }
}

// Update potion quantity
function updatePotionQuantity(potionName, quantity) {
    const potionSlot = document.getElementById(`potion-${potionName.toLowerCase().replace(/\s+/g, '-')}`);
    if (potionSlot) {
        const quantityElement = potionSlot.querySelector('div[style*="position: absolute"][style*="top: -10px"]');
        if (quantityElement) {
            quantityElement.textContent = quantity;
            if (quantity <= 0) {
                potionSlot.remove();
            }
        }
    }
}

export function initializeFightUI() {
    const isDungeon = window.location.pathname.endsWith('dungeon.html');
    let potionBar = null;
    let healthBar = null;
    let witchHealthBar = null;
    
    if (isDungeon) {
        potionBar = createPotionBar();
        healthBar = createHealthBar(false);
        witchHealthBar = createHealthBar(true);
        
        // Set initial health
        healthBar.setHealth(100, 100);
        witchHealthBar.setHealth(100, 100);
    }

    return {
        showFightPrompt: createFightPrompt,
        updatePotions: (onPotionUse) => potionBar && updatePotionBar(potionBar, onPotionUse),
        updateHealth: (current, max) => healthBar && healthBar.setHealth(current, max),
        updateWitchHealth: (current, max) => witchHealthBar && witchHealthBar.setHealth(current, max),
        updatePotionQuantity: (name, quantity) => updatePotionQuantity(name, quantity)
    };
}
