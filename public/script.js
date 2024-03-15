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
    const shopNowButton = document.getElementById('shop-now');
    const exploreButton = document.getElementById('explore');
    const collectionButton = document.getElementById('collection');
    const newsletterButton = document.getElementById('newsletterButton');

    shopNowButton.addEventListener('click', function() {
        window.location.href = '/shop';
    });

    exploreButton.addEventListener('click', function() {
        window.location.href = '/shop';
    });

    collectionButton.addEventListener('click', function() {
        window.location.href = '/shop';
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

    try {
        const response = await fetch('http://localhost:3000/cuddy/products');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        displayTableServiceData(data);

        // Load cart data from local storage
        const cartData = getCartData();

        // Update cart badge count
        updateCartBadgeCount(cartData.length);

        // Display cart items
        displayCartItems(cartData);
    
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayCartItems(cartData) {
    const dropdownCart = document.querySelector('.dropdown-cart');

    // Clear existing cart items
    dropdownCart.innerHTML = '';

    // Iterate over cart data and display cart items
    cartData.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name}</span>
            <span>Size: ${item.size}</span>
            <span>Quantity: ${item.quantity}</span>
            <span>$${item.totalPrice}</span>
            <span class="remove-item">Remove</span>
        `;
        
        // Add event listener to remove item from cart
        const removeButton = cartItem.querySelector('.remove-item');
        removeButton.addEventListener('click', () => {
            // Remove item from cartData
            const index = cartData.findIndex(cartItem => cartItem.id === item.id);
            if (index !== -1) {
                cartData.splice(index, 1);
                // Update local storage and UI
                saveCartData(cartData);
                displayCartItems(cartData);
                updateCartBadgeCount(cartData.length);
            }
        });

        // Append cart item to dropdown cart
        dropdownCart.appendChild(cartItem);
    });
}

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

