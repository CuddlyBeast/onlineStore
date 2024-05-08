const BASE_URL = 'https://cara-c12f08837620.herokuapp.com/';

const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const productContainer = document.querySelector('.pro-container');

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

document.addEventListener('DOMContentLoaded', async function() {
    const orderList = document.querySelector('.order-list');
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await fetch(`${BASE_URL}cuddy/order/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                let orders = await response.json();

                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                for (const order of orders) {
                    // Create a div element for each order
                    const orderItem = document.createElement('div');
                    orderItem.classList.add('order-item');

                    orderItem.innerHTML = `
                        <h3>Order #${order.id}  <button class="delete-order" data-order-id="${order.id}"><i class='bx bx-trash'></i></button></h3>
                        <span>Order Status: ${order.orderStatus}</span>
                        <p>Time of Purchase: ${order.createdAt.slice(11, 19)} | ${order.createdAt.slice(0, 10)}</p>
                        <p>Delivery/Billing Address: ${order.address}, ${order.city}, ${order.postcode},  ${order.country}</p>
                        <p>Payment: ${order.paymentInformation}</p>
                        <p>Discount: $${order.discount}</p>
                        <p>Delivery Type: ${order.deliveryType}</p>
                        <p>Total: <strong>$${order.totalAmount}</strong></p>
                        <div class="order-details-${order.id}"></div>
                    `;
                    const orderDetailsResponse = await fetch(`${BASE_URL}cuddy/order/${order.id}/details`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (orderDetailsResponse.ok) {
                        const orderDetails = await orderDetailsResponse.json();
                        const orderDetailsContainer = orderItem.querySelector(`.order-details-${order.id}`);

                        for (const detail of orderDetails) {
                            const productResponse = await fetch(`${BASE_URL}cuddy/products/${detail.productId}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            });

                            if (productResponse.ok) {
                                const productData = await productResponse.json();

                                orderDetailsContainer.innerHTML += `
                                    <div class="product-details">
                                        <img src="${productData.image}" alt="${productData.name}">
                                        <p>${productData.name}</p>
                                        <p>$${detail.price}</p>
                                        <p>Quantity: ${detail.quantity}</p>
                                        <p>Size: ${detail.size}</p>
                                    </div>
                                `;
                            } else {
                                console.error('Failed to fetch product details');
                            }
                        }
                    } else {
                        console.error('Failed to fetch order details');
                    }

                    orderList.appendChild(orderItem);
                }

                document.querySelectorAll('.delete-order').forEach(button => {
                    button.addEventListener('click', async () => {
                        const orderId = parseInt(button.dataset.orderId);
                        try {
                            const response = await fetch(`${BASE_URL}cuddy/order/${orderId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            });
                            if (!response.ok) {
                                throw new Error('Failed to delete order');
                            }
                            
                            location.reload();
                        } catch (error) {
                            console.error('Error deleting order:', error);
                        }
                    });
            
                   // Get the order creation time
                   const orderId = parseInt(button.dataset.orderId);
                   const order = orders.find(order => order.id === orderId);
                   const orderCreationTime = new Date(order.createdAt).getTime();
            
            
                   // Calculate the time elapsed since the order was made
                   const currentTime = new Date().getTime();
                   const timeElapsed = currentTime - orderCreationTime;
            
                   // Set the timeout to hide the delete button after five minutes since the order was made
                   const timeLimit = 300000;
                   const timeRemaining = Math.max(timeLimit - timeElapsed, 0);

                   setTimeout( async () => {
                        button.style.display = 'none';

                        const updateResponse = await fetch(`${BASE_URL}cuddy/order/${orderId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                orderStatus: 'Delivered' 
                            })
                        });
                        if (!updateResponse.ok) {
                            console.error('Failed to update order status');
                        }

                   }, timeRemaining);
               });
            } else {
                console.error('Failed to fetch order history');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('Token not found');
    }

    const profileIcon = document.querySelector('.profile-dropdown');
    const profileDropdownContent = document.querySelector('.profile-dropdown-content');

    const showProfileDropdownContent = () => {
        profileDropdownContent.style.display = 'block'; 
    };

    const hideProfileDropdownContent = () => {
        profileDropdownContent.style.display = 'none'; 
    };

    const toggleProfileDropdownContent = async () => {
        if (token) {
            try {
                const response = await fetch(`${BASE_URL}cuddy/verifyToken`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    profileIcon.addEventListener('mouseenter', () => {
                        showProfileDropdownContent();
                    });
                    
                    profileIcon.addEventListener('mouseleave', () => {
                        hideProfileDropdownContent();
                    });
                } else {
                    hideProfileDropdownContent(); 
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                hideProfileDropdownContent();
            }
        } else {
            hideProfileDropdownContent();
        }
    };

    await toggleProfileDropdownContent();


    const newsletterButton = document.getElementById('newsletterButton');



    newsletterButton.addEventListener('click', function(event) {
        event.preventDefault();

        if (isValidEmail(emailInput.value)) {
            newsletterButton.textContent = 'Submitted';
        } else {
            newsletterButton.textContent = 'Invalid';
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }



    cartItems = getCartItemsFromStorage();
    displayCartItems(cartItems);
})



function displayCartItems(cartItems) {
const dropdownCart = document.querySelector('.dropdown-cart');
dropdownCart.innerHTML = ''; 
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

             let updatedCartItems = getCartItemsFromStorage();
            
             updatedCartItems = updatedCartItems.filter(cartItem => cartItem.name !== item.name || cartItem.size !== item.size);
             
             saveCartItemsToStorage(updatedCartItems);

             location.reload()
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

const logoutButton = document.getElementById('logout'); 

logoutButton.addEventListener('click', async function(event) { 
    event.preventDefault(); 

    try {
        const response = await fetch(`${BASE_URL}cuddy/logout`, { 
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('token'); 
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