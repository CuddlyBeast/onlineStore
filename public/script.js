const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const productContainer = document.querySelector('.pro-container');
let cartItems = [];

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
    const shopNowButton = document.getElementById('shop-now');
    const exploreButton = document.getElementById('explore');
    const collectionButton = document.getElementById('collection');
    const newsletterButton = document.getElementById('newsletterButton');
    const freeDeliveryButton = document.getElementById('free-delivery');

    cartItems = getCartItemsFromStorage();
    displayCartItems(cartItems);

    shopNowButton.addEventListener('click', function() {
        window.location.href = '/shop';
    });

    exploreButton.addEventListener('click', function() {
        window.location.href = '/shop';
    });

    collectionButton.addEventListener('click', function() {
        window.location.href = '/shop';
    });

    freeDeliveryButton.addEventListener('click', function() {
        window.location.href = '/cart';
    });

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

    const profileIcon = document.querySelector('.profile-dropdown');
    const profileDropdownContent = document.querySelector('.profile-dropdown-content');
    const token = localStorage.getItem('token');

    const showProfileDropdownContent = () => {
        profileDropdownContent.style.display = 'block'; 
    };

    const hideProfileDropdownContent = () => {
        profileDropdownContent.style.display = 'none'; 
    };

    const toggleProfileDropdownContent = async () => {
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/cuddy/verifyToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    showProfileDropdownContent(); 
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

    profileIcon.addEventListener('mouseenter', () => {
        showProfileDropdownContent();
    });
    
    profileIcon.addEventListener('mouseleave', () => {
        hideProfileDropdownContent();
    });

    try {
        const response = await fetch('http://localhost:3000/cuddy/products');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        displayTableServiceData(data);

        const cartData = getCartItemsFromStorage()

        updateCartBadgeCount(cartData.length);

        displayCartItems(cartData);
    
    } catch (error) {
        console.error('Error:', error);
    }
});


function displayTableServiceData(data) {
    let featuredProductsHtml = '';
    let newArrivalsHtml = '';


   
    data.forEach(item => {
    if (item.category === "featured products") {
        featuredProductsHtml += `
        <div class="pro" data-id="${item.id}">
            <img src="${item.image}"> 
            <div class="des">
                <span>${item.brand}</span>
                <h5>${item.name}</h5>
                <div class="star">
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                </div>
                <h4>$${item.price}</h4>
            </div>
            <a href="#"><i class='bx bx-heart cart'></i></a>
        </div>`;
    }
    if (item.category === "new arrivals") {
        newArrivalsHtml += `
        <div class="pro" data-id="${item.id}">
            <img src="${item.image}"> 
            <div class="des">
                <span>${item.brand}</span>
                <h5>${item.name}</h5>
                <div class="star">
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                    <i class='bx bxs-star' ></i>
                </div>
                <h4>$${item.price}</h4>
            </div>
            <a href="#"><i class='bx bx-heart cart'></i></a>
        </div>`;
    }
    });

    productContainer.innerHTML = featuredProductsHtml;
    document.querySelector('.pro-container').innerHTML = featuredProductsHtml;

    document.getElementById("new-arrivals").innerHTML = newArrivalsHtml;
    
    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', (event) => {
            event.preventDefault();

            const productId = product.dataset.id;

            window.location.href = `/product?id=${productId}`;
        });
    });

}



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