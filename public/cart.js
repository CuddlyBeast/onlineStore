const checkout = document.getElementById("checkout-button");

checkout.addEventListener("click", () => {
    window.location.href = "/checkout"
})


document.addEventListener('DOMContentLoaded', async function() {

cartItems = getCartItemsFromStorage();
    displayCartItems(cartItems);
})



function displayCartItems(cartItems) {
const dropdownCart = document.querySelector('.dropdown-cart');
dropdownCart.innerHTML = ''; // Clear previous items
if (Array.isArray(cartItems)) {
    cartItems.forEach(item => {
        const cartItemHtml = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <span>Size: ${item.size}</span>
                <span>Quantity: ${item.quantity}</span>
                <span>Total: $${item.totalPrice}</span>
                <span class="remove-item">Remove</span>
            </div>`;
        dropdownCart.insertAdjacentHTML('beforeend', cartItemHtml);

        const cartItem = dropdownCart.lastElementChild;

        const removeButton = cartItem.querySelector('.remove-item');
        removeButton.addEventListener('click', () => {
            cartItem.remove();
            updateCartBadgeCount(dropdownCart.childElementCount);

             // Retrieve cart items from localStorage
             let updatedCartItems = getCartItemsFromStorage();
            
             // Remove the item from the cart items array
             updatedCartItems = updatedCartItems.filter(cartItem => cartItem.name !== item.name || cartItem.size !== item.size);
             
             // Save updated cart items to localStorage
             saveCartItemsToStorage(updatedCartItems);
        });
    });


    const cartIcon = document.querySelector('.cart-badge');
        cartIcon.addEventListener('mouseenter', () => {
            dropdownCart.style.display = 'block';
        });


    dropdownCart.addEventListener('mouseleave', () => {
        dropdownCart.style.display = 'none';
        });
        updateCartBadgeCount(cartItems.length);
}
updateCartBadgeCount(cartItems.length);
saveCartItemsToStorage(cartItems)
}

function updateCartBadgeCount(count) {
const badge = document.querySelector('.cart-badge .badge');
badge.textContent = count;
}

function saveCartItemsToStorage(cartItems) {
localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function getCartItemsFromStorage() {
return JSON.parse(localStorage.getItem('cartItems')) || [];
}
