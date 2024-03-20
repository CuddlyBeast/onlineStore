const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const productContainer = document.querySelector('.pro-container');
let cartItems = [];
let couponApplied = false;

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active')
    })
}


const checkout = document.getElementById("checkout-button");

function updateCheckoutButton(total) {
    if (total > 0) {
        checkout.disabled = false;
        checkout.innerHTML = "Checkout";
    } else {
        checkout.disabled = true;
        checkout.innerHTML = "Cart is Empty";
    }
}

checkout.addEventListener("click", async () => {
    const token = localStorage.getItem('token');

    const totalAmount = parseFloat(document.getElementById('total').textContent.slice(1));

    if (totalAmount > 0 && token) {
        try {
            const response = await fetch('http://localhost:3000/cuddy/verifyToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const discount = parseFloat(document.getElementById('discount').textContent.slice(2));

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                localStorage.setItem('cartTotal', JSON.stringify({ subtotal: calculateSubtotal(cartItems), total }));
                localStorage.setItem('discount', JSON.stringify(discount));

                window.location.href = "/checkout";
            } else {
                window.location.href = "/authenticate";
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    } else {
        window.location.href = "/authenticate";
    }
});



document.addEventListener('DOMContentLoaded', async function() {

    cartItems = getCartItemsFromStorage();
    let subtotal = calculateSubtotal(cartItems);
    let total = calculateTotal(subtotal);


    displayCartItems(cartItems);
    populateCartPage(cartItems, subtotal, total);

    updateCheckoutButton(total);

    document.querySelectorAll('.quantity-input').forEach(quantityInput => {
        quantityInput.addEventListener('input', () => {
  
            const cartItemIndex = parseInt(quantityInput.dataset.index);
            cartItems[cartItemIndex].quantity = parseInt(quantityInput.value);
            

            subtotal = calculateSubtotal(cartItems);
            total = calculateTotal(subtotal);
            
 
            document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('discount').textContent = `-$${calculateDiscount(subtotal).toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;

            saveCartItemsToStorage(cartItems);

            updateCartBadgeCount(cartItems.length);

            updateCheckoutButton(total);
        });
    });

    const applyCouponButton = document.getElementById('applyCouponButton');

    applyCouponButton.addEventListener('click', function() {
        applyCouponDiscount(subtotal);
        updateCheckoutButton(total); 
    });

})

function populateCartPage(cartItems, subtotal, total) {
    const cartTableBody = document.querySelector('#cart tbody');
    const subtotalElement = document.querySelector('#subtotal td:nth-child(2)');
    const totalElement = document.querySelector('#subtotal td:nth-child(2) strong');

    cartTableBody.innerHTML = '';

    cartItems.forEach(item => {
        const cartItemRow = document.createElement('tr');
        const itemSubtotal = item.quantity * parseFloat(item.price.replace('$', ''));
       
        cartItemRow.innerHTML = `
            <td><a href="#" class="remove-item"><i class='bx bx-x-circle'></i></a></td>
            <td><img src="${item.image}" alt=""></td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.size}</td>
            <td><input type="number" class="quantity-input" value="${item.quantity}" min="1"></td>
            <td class="subtotal">$${itemSubtotal.toFixed(2)}</td>
        `;

        const removeButton = cartItemRow.querySelector('.remove-item');

        removeButton.addEventListener('click', () => {
            cartItems = cartItems.filter(cartItem => cartItem.name !== item.name || cartItem.size !== item.size);
            saveCartItemsToStorage(cartItems);
            updateCartBadgeCount(cartItems.length);

            subtotal = calculateSubtotal(cartItems);
            const discountAmount = calculateDiscount(subtotal);
            total = subtotal - discountAmount;

            populateCartPage(cartItems, subtotal, total);
            updateCheckoutButton(total);

            document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;

            location.reload();
        });



        const quantityInput = cartItemRow.querySelector('.quantity-input');

        quantityInput.addEventListener('input', () => {
            const newQuantity = parseInt(quantityInput.value);
            const newSubtotal = newQuantity * parseFloat(item.price.replace('$', ''));
            cartItemRow.querySelector('.subtotal').textContent = `$${newSubtotal.toFixed(2)}`;

            item.quantity = newQuantity;
            subtotal = calculateSubtotal(cartItems);
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`

            total = calculateTotal(subtotal);
            totalElement.textContent = `$${total.toFixed(2)}`;

            if (couponApplied) {
                const discountAmount = calculateDiscount(subtotal);
                document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
                applyCouponDiscount(subtotal);
            }

            saveCartItemsToStorage(cartItems);

            updateCartBadgeCount(cartItems.length);
        });

        cartTableBody.appendChild(cartItemRow);
    });

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}


function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => {
        return total + (item.quantity * parseFloat(item.price.replace('$', '')));
    }, 0);
}


function calculateTotal(subtotal) {
    return subtotal - calculateDiscount(subtotal);
}


function calculateDiscount(subtotal) {
    if (couponApplied) {
        return 0.2 * subtotal; 
    }
    return 0;
}


function applyCouponDiscount(subtotal) {
    const couponInput = document.getElementById('couponInput');
    const couponCode = couponInput.value.trim().toLowerCase();

    if (isValidCoupon(couponCode) && !couponApplied) {

        couponApplied = true;

        const discountAmount = calculateDiscount(subtotal);

        const discountedTotal = subtotal - discountAmount;

        document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
        document.getElementById('total').textContent = `$${discountedTotal.toFixed(2)}`;
    }
}

function isValidCoupon(couponCode) {
    return couponCode === '#blessed'.toLowerCase() || couponCode === 'blessed'.toLowerCase();
}


function displayCartItems(cartItems) {
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


const logoutButton = document.getElementById('logout'); 

logoutButton.addEventListener('click', async function(event) { 
    event.preventDefault(); 

    try {
        const response = await fetch('http://localhost:3000/cuddy/logout', { 
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartTotal');
            localStorage.removeItem('discount');

            window.location.href = '/'; 
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout Error:', error);
    }
});