const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const productContainer = document.querySelector('.pro-container');

function updateCartBadgeCount(count) {
    const badge = document.querySelector('.cart-badge .badge');
    if (badge) {
        badge.textContent = count;
    } else {
        console.error('Badge element not found.');
    }
}

function saveCartItemsToStorage(cartItems) {
    try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart items to storage:', error);
    }
}

function getCartItemsFromStorage() {
    try {
        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        return storedItems;
    } catch (error) {
        console.error('Error retrieving cart items from storage:', error);
        return [];
    }
}


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



    const cartItems = getCartItemsFromStorage();

    displayCartItems(cartItems);

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


    try {
        // Extract product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            throw new Error('Product ID not found in URL.');
        }    

        const response = await fetch(`http://localhost:3000/cuddy/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        const productData = await response.json();

        const productHtml = `
            <div class="single-pro-image">
                <img src="${productData.image}" width="100%" id="MainImg" alt="">
        
                <div class="small-img-group">
                <div class="small-img-col">
                    <img src="${productData.image2}" width="100%" class="small-img" alt="">
                </div>
                <div class="small-img-col">
                    <img src="${productData.image3}" width="100%" class="small-img" alt="">
                </div>
                <div class="small-img-col">
                    <img src="${productData.image4}" width="100%" class="small-img" alt="">
                </div>
                <div class="small-img-col">
                    <img src="${productData.image5}" width="100%" class="small-img" alt="">
                </div>
            </div>
        </div>

            <div id="${productId}" class="single-pro-details">
            <h6>${productData.brand}</h6>
            <h4>${productData.name}</h4>
            <h2>$${productData.price}</h2>
            <select>
                <option disabled>Select Size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>XL</option>
                <option>XXL</option>
            </select>
            <input type="number" id="quantity" value="1">
            <button class="normal">Add To Cart</button>
            <h4>Product Details</h4>
            <span>${productData.description}</span>
        </div>
        `;


        const productDetailsContainer = document.getElementById('prodetails');
        productDetailsContainer.innerHTML = productHtml;

        const smallImages = document.querySelectorAll('.small-img');
        smallImages.forEach((smallImg) => {
            smallImg.addEventListener('click', () => {
                const mainImg = document.getElementById('MainImg');
                const tempSrc = mainImg.src;
                mainImg.src = smallImg.src;
                smallImg.src = tempSrc;
            });
        });


        const featuredResponse = await fetch('http://localhost:3000/cuddy/products');
        if (!featuredResponse.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await featuredResponse.json();

        let featuredProductsHtml = '';
        let count = 0; 
        
        data.forEach(item => {
        if (item.category === "featured products" && count < 4) {
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
            count++;
        }
    })

    document.querySelector('.pro-container').innerHTML = featuredProductsHtml

    const quantityInput = document.getElementById('quantity'); 

    quantityInput.addEventListener('input', function() {
        let value = parseInt(this.value);

        if (isNaN(value) || value <= 0) {
            this.value = 1; 
        }
    });

    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', (event) => {
            event.preventDefault();

            const productId = product.dataset.id;

            window.location.href = `/product?id=${productId}`;
        });
    });



     const dropdownCart = document.querySelector('.dropdown-cart');

   
     const cartIcon = document.querySelector('.cart-badge');
     cartIcon.addEventListener('mouseenter', () => {
         dropdownCart.style.display = 'block';
     });
 

     dropdownCart.addEventListener('mouseleave', () => {
         dropdownCart.style.display = 'none';
     });
 

     async function addToCart(item, productId) {
        try {
            const sizeSelect = document.querySelector('.single-pro-details select');
            const selectedSize = sizeSelect.options[sizeSelect.selectedIndex].text;
            const quantityInput = document.getElementById('quantity');
            const selectedQuantity = parseInt(quantityInput.value);
            const totalPrice = (parseFloat(item.price.replace('$', '')) * selectedQuantity).toFixed(2);
    
            const cartItem = {
                id: productId,
                name: item.name,
                price: item.price,
                image: item.image,
                size: selectedSize,
                quantity: selectedQuantity,
                totalPrice: totalPrice
            };
    
            let cartItems = getCartItemsFromStorage();
    
            // Check if the same item already exists in the cart
            const existingCartItemIndex = cartItems.findIndex(existingItem =>
                existingItem.name === cartItem.name && existingItem.size === cartItem.size
            );
    
            if (existingCartItemIndex !== -1) {
                // If the item already exists, update its quantity and total price
                cartItems[existingCartItemIndex].quantity += selectedQuantity;
                cartItems[existingCartItemIndex].totalPrice = (parseFloat(cartItems[existingCartItemIndex].price.replace('$', '')) * cartItems[existingCartItemIndex].quantity).toFixed(2);
            } else {
                cartItems.push(cartItem);
            }
    
            saveCartItemsToStorage(cartItems);
    
            displayCartItems(cartItems);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }
 

     const addToCartButton = document.querySelector('.single-pro-details button');
     addToCartButton.addEventListener('click', () => {

         const productName = document.querySelector('.single-pro-details h4').textContent;
         const productPrice = document.querySelector('.single-pro-details h2').textContent;
         const productImage = document.querySelector('.single-pro-image img').src;
         const productId = document.querySelector('.single-pro-details').id;
 
         
         const product = {
             name: productName,
             price: productPrice,
             image: productImage
         };
 
    
         addToCart(product, productId);
     });

    } catch (error) {
        console.error('Error:', error);
    }
});



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