import { shopItemsData } from './Data.js';

document.addEventListener('DOMContentLoaded', () => {
    const shoppingCart = document.getElementById('shopping-cart');
    const label = document.getElementById('label');
    const cartIcon = document.getElementById('cartAmount');
    let basket = JSON.parse(localStorage.getItem('data')) || [];

    const generateCartItems = () => {
        if (basket.length > 0) {
            shoppingCart.innerHTML = basket.map(({ id, item }) => {
                const { img, name, price } = shopItemsData.find(itemData => itemData.id === id);
                return `
                    <div class="cart-item">
                        <img class="cart-image" width="100" src="${img}" alt="${name}">
                        <div class="details">
                        <i data-id="${id}" class="bi bi-x-lg remove-item"></i>
                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${name}</p>
                                    <p class="cart-item-price">#${price}</p>
                                </h4>
                                
                            </div>
                            <div class="buttons">
                                <i data-id="${id}" class="bi bi-dash-lg decrement-btn"></i>
                                <div id="${id}" class="quantity">${item}</div>
                                <i data-id="${id}" class="bi bi-plus-lg increment-btn"></i>
                            </div>
                            <h3>#${item * price}</h3>
                        </div>
                    </div>
                `;
            }).join('');

            attachEventHandlers();
        } else {
            shoppingCart.innerHTML = '';
            label.innerHTML = `
                <h2>Cart is Empty</h2>
                <a href="index.html">
                    <button class="HomeBtn">Back to Home</button>
                </a>
            `;
        }
    };

    const handleIncrement = id => {
        const selectedItem = basket.find(item => item.id === id);
        if (selectedItem) {
            selectedItem.item += 1;
        } else {
            basket.push({ id, item: 1 });
        }
        updateCart();
    };

    const handleDecrement = id => {
        const selectedItem = basket.find(item => item.id === id);
        if (selectedItem) {
            if (selectedItem.item > 1) {
                selectedItem.item -= 1;
            } else {
                basket.splice(basket.indexOf(selectedItem), 1);
            }
            updateCart();
        }
    };

    const handleRemoveItem = id => {
        basket = basket.filter(item => item.id !== id);
        updateCart();
    };

    const clearCart = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Are you sure you want to remove all items?</h2>
                <div>
                    <button class="confirm-clear">Yes</button>
                    <button class="cancel-clear">No</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.querySelector('.confirm-clear').addEventListener('click', () => {
            basket = [];
            updateCart();
            closeModal();
        });
        document.querySelector('.cancel-clear').addEventListener('click', closeModal);
    };

    const sendToWhatsApp = () => {
        const items = basket.map(item => {
            const selectedItem = shopItemsData.find(data => data.id === item.id);
            return `*${selectedItem.name}* (Quantity: ${item.item}) - #${selectedItem.price}\nImage: ${selectedItem.img}\n`;
        }).join('\n');
    
        const totalPrice = basket.reduce((acc, item) => {
            const selectedItem = shopItemsData.find(data => data.id === item.id);
            return acc + (selectedItem.price * item.item);
        }, 0);
    
        const message = `Hello! I'd like to place the following order:\n\n${items}\n*Total Price:* #${totalPrice}\n\nThank you!`;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "+2347035258447";  // Your WhatsApp number
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
        window.open(whatsappUrl, '_blank');  // This opens WhatsApp with the pre-filled message
    
        clearCart();  // Clear the cart after sending the message
    };

    const handleCheckout = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-message">Send your cart to WhatsApp</h2>
                <button class="send-whatsapp">Send to WhatsApp</button>
                <button class="close-modal">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.querySelector('.send-whatsapp').addEventListener('click', sendToWhatsApp);
        document.querySelector('.close-modal').addEventListener('click', closeModal);
    };

    const closeModal = () => {
        const modal = document.querySelector('.modal');
        if (modal) {
            document.body.removeChild(modal);
        }
    };

    const updateCart = () => {
        localStorage.setItem('data', JSON.stringify(basket));
        generateCartItems();
        calculation();
        totalAmount();
    };

    const calculation = () => {
        cartIcon.innerHTML = basket.map(item => item.item).reduce((total, quantity) => total + quantity, 0);
    };

    const totalAmount = () => {
        if (basket.length > 0) {
            const amount = basket.map(({ id, item }) => {
                const { price } = shopItemsData.find(itemData => itemData.id === id);
                return item * price;
            }).reduce((total, value) => total + value, 0);
            label.innerHTML = `
                <h2>Total Bill: #${amount}</h2>
                <button class="checkout">Checkout</button>
                <button class="removeAll">Remove All</button>
            `;

            document.querySelector('.checkout').addEventListener('click', handleCheckout);
            document.querySelector('.removeAll').addEventListener('click', clearCart);
        }
    };

    const attachEventHandlers = () => {
        document.querySelectorAll('.increment-btn').forEach(btn => {
            btn.addEventListener('click', () => handleIncrement(btn.dataset.id));
        });

        document.querySelectorAll('.decrement-btn').forEach(btn => {
            btn.addEventListener('click', () => handleDecrement(btn.dataset.id));
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => handleRemoveItem(btn.dataset.id));
        });
    };

    generateCartItems();
    updateCart();
});
