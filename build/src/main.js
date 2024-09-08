import { shopItemsData } from './Data.js';

const cartIcon = document.getElementById('cartAmount');

// Initialize basket
const basket = JSON.parse(localStorage.getItem('data')) || [];

// Function to search and display shop items based on the query
export function searchShopItems(query) {
    const filteredShopItems = shopItemsData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
    displayShopItems(filteredShopItems);
}

// Function to display shop items
function displayShopItems(items) {
    const shop = document.getElementById('shop');
    if (shop) {
        shop.innerHTML = items.map(({ id, name, price, desc, img }) => {
            const quantity = basket.find(item => item.id === id)?.item || 0;
            return `
                <div id="product-id-${id}" class="item">
                    <img width="218" src="${img}" alt="${name}">
                    <div class="details">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        <div class="price-quantity">
                            <h4>#${price}</h4>
                            <div class="buttons">
                                <i data-id="${id}" class="bi bi-dash-lg decrement-btn"></i>
                                <div id="quantity-${id}" class="quantity">${quantity}</div>
                                <i data-id="${id}" class="bi bi-plus-lg increment-btn"></i>
                            </div>
                        </div>
                    </div>
                    <button class="place-order"><a href="cart.html">Place your order!</a></button>
                </div>
            `;
        }).join('');

        attachEventHandlers();
    }
}

// Function to handle increment action
const handleIncrement = id => {
    const selectedItem = basket.find(item => item.id === id);
    if (selectedItem) {
        selectedItem.item += 1;
    } else {
        basket.push({ id, item: 1 });
    }
    updateBasket();
};

// Function to handle decrement action
const handleDecrement = id => {
    const selectedItem = basket.find(item => item.id === id);
    if (selectedItem) {
        if (selectedItem.item > 1) {
            selectedItem.item -= 1;
        } else {
            basket.splice(basket.indexOf(selectedItem), 1);
        }
        updateBasket();
    }
};

// Function to update the basket and display items
const updateBasket = () => {
    localStorage.setItem('data', JSON.stringify(basket));
    generateShop();
    calculation();
};

// Function to update the cart icon with the total item count
const calculation = () => {
    cartIcon.innerHTML = basket.map(item => item.item).reduce((total, quantity) => total + quantity, 0);
};

// Function to attach event handlers to buttons
const attachEventHandlers = () => {
    document.querySelectorAll('.increment-btn').forEach(btn => {
        btn.addEventListener('click', () => handleIncrement(btn.dataset.id));
    });

    document.querySelectorAll('.decrement-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDecrement(btn.dataset.id));
    });
};

// Function to generate and display shop items
const generateShop = () => {
    displayShopItems(shopItemsData);
};

// Initialize and display shop items on page load
document.addEventListener('DOMContentLoaded', () => {
    const shopSearchInput = document.getElementById('shop-search');

    if (shopSearchInput) {
        shopSearchInput.addEventListener('input', (e) => {
            searchShopItems(e.target.value);
        });
    }

    generateShop();
});
