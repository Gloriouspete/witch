import * as THREE from 'three';
import { chemicals } from './chemicals.js';
import { potionCombinations, getCombinationKey } from './potion-combinations.js';
import { getInventory, removeFromInventory, addPotionToInventory } from './inventory-system.js';

export function createBrewingUI(liquid, bubbles, cauldronLight) {
    const brewingUI = document.createElement('div');
    brewingUI.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        border: 3px solid #8b4513;
        padding: 20px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        font-family: 'MedievalSharp', cursive;
        color: #d4af37;
        min-width: 300px;
        box-shadow: 
            inset 0 0 20px rgba(139, 69, 19, 0.5),
            0 0 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
    `;

    const brewingTitle = document.createElement('div');
    brewingTitle.textContent = '🧪 Brewing Station';
    brewingTitle.style.cssText = `
        font-size: 24px;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        margin-bottom: 10px;
    `;
    brewingUI.appendChild(brewingTitle);

    const chemicalSelectors = document.createElement('div');
    chemicalSelectors.style.cssText = `
        display: flex;
        gap: 20px;
        align-items: center;
    `;

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #1a0f0a, #2a1810);
            border: 3px solid #8b4513;
            padding: ${isError ? '20px' : '30px'};
            border-radius: 15px;
            color: ${isError ? '#ff4444' : '#d4af37'};
            font-family: 'MedievalSharp', cursive;
            text-align: center;
            z-index: 2000;
            animation: fadeIn 0.5s ease;
        `;

        if (isError) {
            notification.textContent = message;
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000);
        } else {
            const content = document.createElement('div');
            content.innerHTML = message;
            content.style.marginBottom = '20px';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.cssText = `
                background: linear-gradient(45deg, #2a1810, #3a2510);
                border: 2px solid #8b4513;
                color: #d4af37;
                padding: 10px 30px;
                font-size: 16px;
                cursor: pointer;
                border-radius: 10px;
                font-family: 'MedievalSharp', cursive;
                transition: all 0.3s ease;
            `;
            closeBtn.onmouseover = () => {
                closeBtn.style.transform = 'scale(1.05)';
                closeBtn.style.boxShadow = '0 0 15px rgba(139, 69, 19, 0.3)';
            };
            closeBtn.onmouseout = () => {
                closeBtn.style.transform = 'scale(1)';
                closeBtn.style.boxShadow = 'none';
            };
            closeBtn.onclick = () => document.body.removeChild(notification);

            notification.appendChild(content);
            notification.appendChild(closeBtn);
        }

        document.body.appendChild(notification);
    }

    function createChemicalSelector() {
        const selector = document.createElement('div');
        selector.style.cssText = `
            width: 120px;
            height: 160px;
            background: rgba(139, 69, 19, 0.2);
            border: 2px solid #8b4513;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 10px;
        `;

        const bottle = document.createElement('div');
        bottle.style.cssText = `
            width: 40px;
            height: 60px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0 0 20px 20px;
            border: 2px solid #8b4513;
            position: relative;
            margin-bottom: 10px;
        `;

        const neck = document.createElement('div');
        neck.style.cssText = `
            width: 20px;
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #8b4513;
            border-radius: 5px;
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
        `;
        bottle.appendChild(neck);

        const liquidElement = document.createElement('div');
        liquidElement.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 75%;
            background: transparent;
            border-radius: 0 0 18px 18px;
            transition: all 0.3s ease;
        `;
        bottle.appendChild(liquidElement);

        const label = document.createElement('div');
        label.style.cssText = `
            text-align: center;
            font-size: 14px;
            color: #d4af37;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        label.textContent = 'Select Chemical';

        selector.appendChild(bottle);
        selector.appendChild(label);

        selector.addEventListener('mouseover', () => {
            selector.style.transform = 'scale(1.05)';
            selector.style.boxShadow = '0 0 15px rgba(139, 69, 19, 0.3)';
        });

        selector.addEventListener('mouseout', () => {
            selector.style.transform = 'scale(1)';
            selector.style.boxShadow = 'none';
        });

        selector.addEventListener('click', () => showChemicalOptions(selector, liquidElement, label));

        return selector;
    }

    function showChemicalOptions(selector, liquidElement, label) {
        const inventory = getInventory();
        const hasItems = Array.from(inventory.values()).some(data => data.quantity > 0);

        if (!hasItems) {
            showNotification(`
                <div style="font-size: 24px; margin-bottom: 15px;">
                    🧪 Empty Inventory!
                </div>
                <div style="color: #8b4513; font-style: italic;">
                    You don't have any chemicals left.<br>
                    Visit Mystic Chemicals to buy more!
                </div>
            `);
            return;
        }

        const chemicalOptions = document.createElement('div');
        chemicalOptions.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #1a0f0a, #2a1810);
            border: 3px solid #8b4513;
            padding: 20px;
            border-radius: 15px;
            z-index: 2000;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            max-width: 80vw;
            max-height: 80vh;
            overflow-y: auto;
        `;

        for (const [name, data] of inventory) {
            if (data.quantity > 0) {
                const option = createChemicalOption(name, data);
                option.addEventListener('click', () => {
                    selectChemical(name, data.color, selector, liquidElement, label);
                    document.body.removeChild(chemicalOptions);
                });
                chemicalOptions.appendChild(option);
            }
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #d4af37;
            font-size: 24px;
            cursor: pointer;
            padding: 5px 10px;
            transition: all 0.3s ease;
        `;
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(chemicalOptions);
        });
        chemicalOptions.appendChild(closeBtn);

        document.body.appendChild(chemicalOptions);
    }

    function createChemicalOption(name, data) {
        const option = document.createElement('div');
        option.style.cssText = `
            background: rgba(139, 69, 19, 0.2);
            border: 2px solid #8b4513;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        `;

        const miniBottle = document.createElement('div');
        miniBottle.style.cssText = `
            width: 20px;
            height: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0 0 10px 10px;
            border: 2px solid #8b4513;
            position: relative;
        `;

        const miniLiquid = document.createElement('div');
        miniLiquid.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 75%;
            background: ${data.color};
            border-radius: 0 0 8px 8px;
            filter: brightness(1.5);
            box-shadow: 0 0 10px ${data.color};
        `;
        miniBottle.appendChild(miniLiquid);

        const optionText = document.createElement('div');
        optionText.style.cssText = `
            flex-grow: 1;
            color: #d4af37;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
        `;
        optionText.textContent = `${name} (${data.quantity})`;

        option.appendChild(miniBottle);
        option.appendChild(optionText);

        option.addEventListener('mouseover', () => {
            option.style.transform = 'scale(1.05)';
            option.style.boxShadow = '0 0 15px rgba(139, 69, 19, 0.3)';
        });

        option.addEventListener('mouseout', () => {
            option.style.transform = 'scale(1)';
            option.style.boxShadow = 'none';
        });

        return option;
    }

    function selectChemical(name, color, selector, liquidElement, label) {
        liquidElement.style.background = color;
        liquidElement.style.boxShadow = `0 0 10px ${color}`;
        label.textContent = name;
        selector.dataset.selected = name;
        
        const selectors = Array.from(chemicalSelectors.children)
            .filter(child => child.tagName === 'DIV' && child.children.length > 0);
        const selectedChemicals = selectors
            .map(s => s.dataset.selected)
            .filter(Boolean);
            
        if (selectedChemicals.length === 2) {
            brewButton.style.opacity = '1';
            brewButton.style.cursor = 'pointer';
        }
    }

    function resetSelectors() {
        const selectors = Array.from(chemicalSelectors.children)
            .filter(child => child.tagName === 'DIV' && child.children.length > 0);
        selectors.forEach(selector => {
            const liquid = selector.querySelector('div > div:last-child');
            const label = selector.querySelector('div:last-child');
            if (liquid) {
                liquid.style.background = 'transparent';
                liquid.style.boxShadow = 'none';
            }
            if (label) label.textContent = 'Select Chemical';
            delete selector.dataset.selected;
        });

        brewButton.style.opacity = '0.5';
        brewButton.style.cursor = 'not-allowed';
    }

    const selector1 = createChemicalSelector();
    const selector2 = createChemicalSelector();
    
    const plusSign = document.createElement('div');
    plusSign.textContent = '+';
    plusSign.style.cssText = `
        font-size: 32px;
        color: #d4af37;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    `;

    chemicalSelectors.appendChild(selector1);
    chemicalSelectors.appendChild(plusSign);
    chemicalSelectors.appendChild(selector2);
    brewingUI.appendChild(chemicalSelectors);

    const brewButton = document.createElement('button');
    brewButton.textContent = '🔮 Brew Potion';
    brewButton.style.cssText = `
        background: linear-gradient(45deg, #2a1810, #3a2510);
        border: 2px solid #8b4513;
        color: #d4af37;
        padding: 10px 20px;
        font-size: 18px;
        cursor: not-allowed;
        opacity: 0.5;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-family: 'MedievalSharp', cursive;
        margin-top: 10px;
    `;

    brewButton.addEventListener('mouseover', () => {
        if (brewButton.style.opacity === '1') {
            brewButton.style.transform = 'scale(1.05)';
            brewButton.style.boxShadow = '0 0 15px rgba(139, 69, 19, 0.3)';
        }
    });

    brewButton.addEventListener('mouseout', () => {
        brewButton.style.transform = 'scale(1)';
        brewButton.style.boxShadow = 'none';
    });

    brewButton.addEventListener('click', () => {
        if (brewButton.style.opacity !== '1') return;

        const selectors = Array.from(chemicalSelectors.children)
            .filter(child => child.tagName === 'DIV' && child.children.length > 0);
        const selectedChemicals = selectors
            .map(s => s.dataset.selected)
            .filter(Boolean);

        if (selectedChemicals.length === 2) {
            const combinationKey = getCombinationKey(selectedChemicals[0], selectedChemicals[1]);
            const potion = potionCombinations[combinationKey];

            if (potion) {
                // Try to remove chemicals from inventory
                const chemical1Removed = removeFromInventory(selectedChemicals[0]);
                const chemical2Removed = removeFromInventory(selectedChemicals[1]);

                if (chemical1Removed && chemical2Removed) {
                    // Mix the colors of the two chemicals
                    const color1 = new THREE.Color(chemicals.find(c => c.name === selectedChemicals[0]).color);
                    const color2 = new THREE.Color(chemicals.find(c => c.name === selectedChemicals[1]).color);
                    const mixedColor = new THREE.Color(
                        (color1.r + color2.r) / 2,
                        (color1.g + color2.g) / 2,
                        (color1.b + color2.b) / 2
                    );
                    const mixedHex = mixedColor.getHex();
                    const mixedHexString = `#${mixedHex.toString(16).padStart(6, '0')}`;

                    // Update cauldron appearance
                    liquid.material.color.setHex(mixedHex);
                    liquid.material.emissive.setHex(mixedHex);
                    cauldronLight.color.setHex(mixedHex);

                    bubbles.forEach(bubble => {
                        bubble.material.color.setHex(mixedHex);
                        bubble.material.emissive.setHex(mixedHex);
                    });

                    // Add potion to inventory
                    addPotionToInventory(potion, mixedHexString);

                    showNotification(`
                        <h2 style="margin: 0 0 20px 0; font-size: 28px; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);">
                            🧪 Potion Created!
                        </h2>
                        <div style="font-size: 20px; margin-bottom: 10px;">
                            ${potion.name}
                        </div>
                        <div style="color: #8b4513; font-style: italic;">
                            ${potion.effect}
                        </div>
                    `);

                    resetSelectors();
                } else {
                    showNotification("Not enough chemicals in inventory!", true);
                }
            } else {
                showNotification("Invalid combination!", true);
            }
        }
    });

    brewingUI.appendChild(brewButton);
    document.body.appendChild(brewingUI);
}
