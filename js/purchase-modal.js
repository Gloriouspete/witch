export class PurchaseModal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.id = 'purchase-modal';
        this.modal.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #2a1810, #3a2510);
            border: 3px solid #8b4513;
            border-radius: 15px;
            padding: 20px;
            z-index: 2000;
            text-align: center;
            min-width: 300px;
            box-shadow: 0 0 30px rgba(139, 69, 19, 0.5);
        `;

        const content = `
            <h2 style="color: #ffd700; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-family: 'Times New Roman', serif;">
                Confirm Purchase
            </h2>
            <p id="purchase-text" style="color: #fff; margin: 20px 0; font-size: 18px;">
                Would you like to buy this potion?
            </p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                <button id="confirm-purchase" style="
                    padding: 10px 25px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    font-weight: bold;
                    background: #4CAF50;
                    color: white;
                ">Yes</button>
                <button id="cancel-purchase" style="
                    padding: 10px 25px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    font-weight: bold;
                    background: #f44336;
                    color: white;
                ">No</button>
            </div>
        `;

        this.modal.innerHTML = content;
        document.body.appendChild(this.modal);

        // Setup event listeners
        this.confirmButton = this.modal.querySelector('#confirm-purchase');
        this.cancelButton = this.modal.querySelector('#cancel-purchase');
        this.purchaseText = this.modal.querySelector('#purchase-text');
        
        this.confirmButton.addEventListener('mouseover', () => {
            this.confirmButton.style.transform = 'scale(1.05)';
            this.confirmButton.style.background = '#45a049';
        });
        
        this.confirmButton.addEventListener('mouseout', () => {
            this.confirmButton.style.transform = 'scale(1)';
            this.confirmButton.style.background = '#4CAF50';
        });
        
        this.cancelButton.addEventListener('mouseover', () => {
            this.cancelButton.style.transform = 'scale(1.05)';
            this.cancelButton.style.background = '#da190b';
        });
        
        this.cancelButton.addEventListener('mouseout', () => {
            this.cancelButton.style.transform = 'scale(1)';
            this.cancelButton.style.background = '#f44336';
        });
    }

    show(potionName, price, onConfirm, onCancel) {
        this.purchaseText.textContent = `Would you like to buy ${potionName} for ${price}?`;
        this.modal.style.display = 'block';
        
        const handleConfirm = () => {
            onConfirm();
            this.hide();
            this.confirmButton.removeEventListener('click', handleConfirm);
            this.cancelButton.removeEventListener('click', handleCancel);
        };
        
        const handleCancel = () => {
            onCancel();
            this.hide();
            this.confirmButton.removeEventListener('click', handleConfirm);
            this.cancelButton.removeEventListener('click', handleCancel);
        };
        
        this.confirmButton.addEventListener('click', handleConfirm);
        this.cancelButton.addEventListener('click', handleCancel);
    }

    hide() {
        this.modal.style.display = 'none';
    }
}
