import { showPurchaseModal, hidePurchaseModal, updateBudget, showMessage } from './purchase-handler.js';
import { addToInventory } from './inventory-system.js';

let selectedPotion = null;
let selectedPotionObject = null;
let controls = null;

export function initializePurchaseInteractions(orbitControls) {
    controls = orbitControls;

    // Set up window functions for modal buttons
    window.confirmPurchase = function() {
        if (selectedPotion) {
            const price = parseInt(selectedPotion.price.replace('$', ''));
            if (updateBudget(-price)) {
                // Format potion data for storage
                const potionData = {
                    name: selectedPotion.name,
                    price: selectedPotion.price,
                    color: `#${selectedPotion.color.toString(16).padStart(6, '0')}`,
                    glow: selectedPotion.glow || 0.5
                };
                
                // Add to inventory
                addToInventory(potionData);
                
                showMessage(`Purchased ${selectedPotion.name} for ${selectedPotion.price}!`);
                
                // Visual feedback
                if (selectedPotionObject) {
                    const liquid = selectedPotionObject.children.find(child => child.userData.isLiquid);
                    if (liquid) {
                        liquid.material.emissiveIntensity = 1.0;
                        setTimeout(() => {
                            liquid.material.emissiveIntensity = selectedPotion.glow || 0.2;
                        }, 200);
                    }
                }
            }
        }
        hidePurchaseModal();
        if (controls) controls.enabled = true;
        selectedPotion = null;
        selectedPotionObject = null;
    };

    window.cancelPurchase = function() {
        hidePurchaseModal();
        if (controls) controls.enabled = true;
        selectedPotion = null;
        selectedPotionObject = null;
    };
}

export function handlePotionClick(potion, potionObject) {
    selectedPotion = potion;
    selectedPotionObject = potionObject;
    if (controls) controls.enabled = false;
    showPurchaseModal(selectedPotion, selectedPotionObject, controls);
}
