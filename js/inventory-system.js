import { chemicals } from './chemicals.js';

// Store the player's inventory
let inventory = new Map();
let potionInventory = new Map();

// Load saved inventory immediately when module loads
const saved = localStorage.getItem('witchInventory');
const savedPotions = localStorage.getItem('witchPotionInventory');

if (saved) {
    try {
        const parsed = JSON.parse(saved);
        inventory = new Map(parsed);
    } catch (e) {
        console.error('Error loading inventory:', e);
    }
}

if (savedPotions) {
    try {
        const parsed = JSON.parse(savedPotions);
        potionInventory = new Map(parsed);
    } catch (e) {
        console.error('Error loading potion inventory:', e);
    }
}

// DOM Elements
let inventoryPanel = null;
let inventoryItems = null;
let potionItems = null;
let emptyInventoryMessage = null;
let emptyPotionMessage = null;

export function initializeInventory() {
    // Create inventory button
    const inventoryBtn = document.createElement('button');
    inventoryBtn.id = 'inventory-button';
    inventoryBtn.innerHTML = '🧪 Inventory';
    inventoryBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        color: #d4af37;
        border: 2px solid #8b4513;
        font-size: 20px;
        font-family: 'MedievalSharp', cursive;
        z-index: 9999;
        cursor: pointer;
        text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
        box-shadow: 
            inset 0 0 10px rgba(139, 69, 19, 0.5),
            0 0 15px rgba(139, 69, 19, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    // Add hover effects
    inventoryBtn.addEventListener('mouseover', () => {
        inventoryBtn.style.transform = 'scale(1.05)';
        inventoryBtn.style.boxShadow = 'inset 0 0 15px rgba(139, 69, 19, 0.7), 0 0 20px rgba(139, 69, 19, 0.5)';
    });

    inventoryBtn.addEventListener('mouseout', () => {
        inventoryBtn.style.transform = 'scale(1)';
        inventoryBtn.style.boxShadow = 'inset 0 0 10px rgba(139, 69, 19, 0.5), 0 0 15px rgba(139, 69, 19, 0.3)';
    });

    // Create inventory panel
    const panel = document.createElement('div');
    panel.id = 'inventory-panel';
    panel.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #1a0f0a, #2a1810);
        border: 3px solid #8b4513;
        padding: 30px;
        z-index: 2000;
        min-width: 800px;
        min-height: 400px;
        box-shadow: 
            inset 0 0 20px rgba(139, 69, 19, 0.5),
            0 0 30px rgba(0, 0, 0, 0.5);
    `;

    // Create sections container
    const sectionsContainer = document.createElement('div');
    sectionsContainer.style.cssText = `
        display: flex;
        gap: 30px;
        height: 100%;
    `;

    // Create chemicals section
    const chemicalsSection = document.createElement('div');
    chemicalsSection.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
    `;

    const chemicalsTitle = document.createElement('h2');
    chemicalsTitle.textContent = '🧪 Your Chemicals';
    chemicalsTitle.style.cssText = `
        color: #d4af37;
        text-align: center;
        margin: 0 0 20px 0;
        font-size: 24px;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        font-family: 'MedievalSharp', cursive;
    `;
    chemicalsSection.appendChild(chemicalsTitle);

    // Create potions section
    const potionsSection = document.createElement('div');
    potionsSection.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        border-left: 2px solid #8b4513;
        padding-left: 30px;
    `;

    const potionsTitle = document.createElement('h2');
    potionsTitle.textContent = '🔮 Your Potions';
    potionsTitle.style.cssText = `
        color: #d4af37;
        text-align: center;
        margin: 0 0 20px 0;
        font-size: 24px;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        font-family: 'MedievalSharp', cursive;
    `;
    potionsSection.appendChild(potionsTitle);

    // Create close button
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

    // Create reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '';
    resetBtn.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: none;
        border: 0px solid #8b4513;
        color: #d4af37;
        font-size: 14px;
        cursor: pointer;
        padding: 5px 10px;
        transition: all 0.3s ease;
        font-family: 'MedievalSharp', cursive;
    `;

    // Create items containers
    const items = document.createElement('div');
    items.id = 'inventory-items';
    items.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        padding: 20px;
        flex-grow: 1;
    `;

    const potionItemsContainer = document.createElement('div');
    potionItemsContainer.id = 'potion-items';
    potionItemsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        padding: 20px;
        flex-grow: 1;
    `;

    // Create empty messages
    const emptyMsg = document.createElement('div');
    emptyMsg.id = 'empty-inventory';
    emptyMsg.textContent = 'Your chemical inventory is empty...';
    emptyMsg.style.cssText = `
        color: #8b4513;
        text-align: center;
        font-style: italic;
        padding: 20px;
        display: none;
        font-family: 'MedievalSharp', cursive;
    `;

    const emptyPotionMsg = document.createElement('div');
    emptyPotionMsg.id = 'empty-potions';
    emptyPotionMsg.textContent = 'Your potion inventory is empty...';
    emptyPotionMsg.style.cssText = `
        color: #8b4513;
        text-align: center;
        font-style: italic;
        padding: 20px;
        display: none;
        font-family: 'MedievalSharp', cursive;
    `;

    // Assemble panel
    chemicalsSection.appendChild(items);
    chemicalsSection.appendChild(emptyMsg);
    potionsSection.appendChild(potionItemsContainer);
    potionsSection.appendChild(emptyPotionMsg);

    sectionsContainer.appendChild(chemicalsSection);
    sectionsContainer.appendChild(potionsSection);

    panel.appendChild(closeBtn);
    panel.appendChild(resetBtn);
    panel.appendChild(sectionsContainer);

    // Add to document
    document.body.appendChild(inventoryBtn);
    document.body.appendChild(panel);

    // Store references
    inventoryPanel = panel;
    inventoryItems = items;
    potionItems = potionItemsContainer;
    emptyInventoryMessage = emptyMsg;
    emptyPotionMessage = emptyPotionMsg;

    // Add event listeners
    inventoryBtn.addEventListener('click', toggleInventory);
    closeBtn.addEventListener('click', closeInventory);
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('witchInventory');
        localStorage.removeItem('witchPotionInventory');
        localStorage.removeItem('witchBudget');
        inventory = new Map();
        potionInventory = new Map();
        updateDisplay();
        location.reload();
    });

    window.addEventListener('click', (e) => {
        if (e.target === panel) {
            closeInventory();
        }
    });

    // Initial display update
    updateDisplay();
}

export function addToInventory(chemical) {
    const existingData = inventory.get(chemical.name);
    if (existingData) {
        existingData.quantity = (existingData.quantity || 1) + 1;
        inventory.set(chemical.name, existingData);
    } else {
        inventory.set(chemical.name, { ...chemical, quantity: 1 });
    }
    
    localStorage.setItem('witchInventory', JSON.stringify(Array.from(inventory.entries())));
    updateDisplay();
}

export function addPotionToInventory(potion, color) {
    const existingData = potionInventory.get(potion.name);
    if (existingData) {
        existingData.quantity = (existingData.quantity || 1) + 1;
        potionInventory.set(potion.name, existingData);
    } else {
        potionInventory.set(potion.name, { 
            ...potion, 
            quantity: 1,
            color: color
        });
    }
    
    localStorage.setItem('witchPotionInventory', JSON.stringify(Array.from(potionInventory.entries())));
    updateDisplay();
}

export function removeFromInventory(chemicalName) {
    const data = inventory.get(chemicalName);
    if (data && data.quantity > 0) {
        data.quantity--;
        if (data.quantity === 0) {
            inventory.delete(chemicalName);
        } else {
            inventory.set(chemicalName, data);
        }
        localStorage.setItem('witchInventory', JSON.stringify(Array.from(inventory.entries())));
        updateDisplay();
        return true;
    }
    return false;
}

export function toggleInventory() {
    if (!inventoryPanel) return;
    
    if (inventoryPanel.style.display === 'none') {
        inventoryPanel.style.display = 'block';
        updateDisplay();
    } else {
        inventoryPanel.style.display = 'none';
    }
}

function closeInventory() {
    if (inventoryPanel) {
        inventoryPanel.style.display = 'none';
    }
}

function updateDisplay() {
    if (!inventoryItems || !emptyInventoryMessage || !potionItems || !emptyPotionMessage) return;

    // Update chemicals
    inventoryItems.innerHTML = '';
    if (inventory.size === 0) {
        emptyInventoryMessage.style.display = 'block';
    } else {
        emptyInventoryMessage.style.display = 'none';
        for (const [name, data] of inventory) {
            const item = createChemicalItem(name, data);
            inventoryItems.appendChild(item);
        }
    }

    // Update potions
    potionItems.innerHTML = '';
    if (potionInventory.size === 0) {
        emptyPotionMessage.style.display = 'block';
    } else {
        emptyPotionMessage.style.display = 'none';
        for (const [name, data] of potionInventory) {
            const item = createPotionItem(name, data);
            potionItems.appendChild(item);
        }
    }
}

function createChemicalItem(name, data) {
    const item = document.createElement('div');
    item.className = 'inventory-item';
    item.style.cssText = `
        background: rgba(139, 69, 19, 0.2);
        border: 2px solid #8b4513;
        padding: 15px;
        text-align: center;
        color: #d4af37;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-family: 'MedievalSharp', cursive;
    `;

    item.innerHTML = `
        <div style="
            width: 50px;
            height: 60px;
            margin: 0 auto;
            position: relative;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0 0 15px 15px;
            border: 2px solid ${data.color};
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 75%;
                background: ${data.color};
                filter: brightness(1.5);
                box-shadow: 0 0 20px ${data.color};
            "></div>
            <div style="
                position: absolute;
                top: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid ${data.color};
                border-radius: 5px;
            "></div>
        </div>
        <div style="
            font-size: 16px;
            color: #d4af37;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
            margin-top: 10px;
        ">${name}</div>
        <div style="
            font-size: 14px;
            color: #8b4513;
        ">Quantity: ${data.quantity}</div>
    `;

    item.addEventListener('mouseover', () => {
        item.style.transform = 'scale(1.05)';
        item.style.boxShadow = `0 0 20px ${data.color}`;
        item.style.border = `2px solid ${data.color}`;
    });

    item.addEventListener('mouseout', () => {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = 'none';
        item.style.border = '2px solid #8b4513';
    });

    return item;
}

function createPotionItem(name, data) {
    const item = document.createElement('div');
    item.className = 'potion-item';
    item.style.cssText = `
        background: rgba(139, 69, 19, 0.2);
        border: 2px solid #8b4513;
        padding: 15px;
        text-align: center;
        color: #d4af37;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-family: 'MedievalSharp', cursive;
    `;

    item.innerHTML = `
        <div style="
            width: 40px;
            height: 70px;
            margin: 0 auto;
            position: relative;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 35% 35% 30% 30%;
            border: 2px solid ${data.color};
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 80%;
                background: ${data.color};
                filter: brightness(1.5);
                box-shadow: 0 0 20px ${data.color};
                border-radius: 30% 30% 20% 20%;
            "></div>
            <div style="
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 16px;
                height: 8px;
                background: #2a1810;
                border: 2px solid ${data.color};
                border-radius: 5px;
            "></div>
        </div>
        <div style="
            font-size: 16px;
            color: #d4af37;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
            margin-top: 10px;
        ">${name}</div>
        <div style="
            font-size: 12px;
            color: #8b4513;
            font-style: italic;
            margin: -5px 0;
        ">${data.effect}</div>
        <div style="
            font-size: 14px;
            color: #8b4513;
        ">Quantity: ${data.quantity}</div>
    `;

    item.addEventListener('mouseover', () => {
        item.style.transform = 'scale(1.05)';
        item.style.boxShadow = `0 0 20px ${data.color}`;
        item.style.border = `2px solid ${data.color}`;
    });

    item.addEventListener('mouseout', () => {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = 'none';
        item.style.border = '2px solid #8b4513';
    });

    return item;
}

export function getInventory() {
    return inventory;
}

export function getPotionInventory() {
    return potionInventory;
}
