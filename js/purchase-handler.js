import { addToInventory } from './inventory-system.js';

// Global state
let currentPotion = null;
let currentPotionObject = null;
let budget = 250;

// Load budget from localStorage
const savedBudget = localStorage.getItem('witchBudget');
if (savedBudget) {
    budget = parseInt(savedBudget);
}

// DOM Elements
const budgetDisplay = document.getElementById('budget-display');
const messageDisplay = document.getElementById('message-display');
const purchaseModal = document.getElementById('purchase-modal');
const purchaseText = document.getElementById('purchase-text');

export function updateBudget(amount) {
    // Check if we would go negative
    if (budget + amount < 0) {
        showMessage("Not enough money! Look around the map for cash spawns.", true);
        return false;
    }
    budget += amount;
    budgetDisplay.textContent = `Budget: $${budget}`;
    // Save budget to localStorage
    localStorage.setItem('witchBudget', budget.toString());
    return true;
}

export function showMessage(message, isError = false) {
    messageDisplay.style.display = 'block';
    messageDisplay.style.color = isError ? '#ff4444' : '#44ff44';
    messageDisplay.textContent = message;
    setTimeout(() => {
        messageDisplay.style.display = 'none';
    }, 2000);
}

export function showPurchaseModal(potion, potionObj, controls) {
    const price = parseInt(potion.price.replace('$', ''));
    if (price > budget) {
        showMessage("Not enough money! Look around the map for cash spawns.", true);
        if (controls) controls.enabled = true;  // Re-enable controls if can't afford
        return;
    }
    
    currentPotion = potion;
    currentPotionObject = potionObj;
    purchaseText.textContent = `Would you like to buy ${potion.name} for ${potion.price}?`;
    purchaseModal.style.display = 'block';
}

export function hidePurchaseModal() {
    purchaseModal.style.display = 'none';
    currentPotion = null;
    currentPotionObject = null;
}

export function confirmPurchase() {
    if (currentPotion) {
        const price = parseInt(currentPotion.price.replace('$', ''));
        if (updateBudget(-price)) {
            // Convert the color number to a proper hex string
            const colorHex = '#' + ('000000' + currentPotion.color.toString(16)).slice(-6);
            
            // Add to inventory with color information
            const potionWithColor = {
                ...currentPotion,
                color: colorHex
            };
            addToInventory(potionWithColor);
            
            showMessage(`Purchased ${currentPotion.name} for ${currentPotion.price}!`);
            
            // Visual feedback
            if (currentPotionObject) {
                const liquid = currentPotionObject.children.find(child => child.userData.isLiquid);
                if (liquid) {
                    liquid.material.emissiveIntensity = 1.0;
                    setTimeout(() => {
                        liquid.material.emissiveIntensity = currentPotion.glow || 0.2;
                    }, 200);
                }
            }
        }
    }
    hidePurchaseModal();
}

export function cancelPurchase() {
    hidePurchaseModal();
}

// Initialize budget display
budgetDisplay.textContent = `Budget: $${budget}`;
