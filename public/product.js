const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const productContainer = document.querySelector('.pro-container');

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

        // Fetch specific product data using the product ID
        const response = await fetch(`http://localhost:3000/cuddy/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        const productData = await response.json();

        // Generate HTML using the product image
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

            <div class="single-pro-details">
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
 

     function addToCart(item) {
        const sizeSelect = document.querySelector('.single-pro-details select');
        const selectedSize = sizeSelect.options[sizeSelect.selectedIndex].text;
        const quantityInput = document.getElementById('quantity');
        const selectedQuantity = parseInt(quantityInput.value);
        const totalPrice = (parseFloat(item.price.replace('$', '')) * selectedQuantity).toFixed(2);

        const existingCartItem = Array.from(dropdownCart.children).find(cartItem => {
            const itemName = cartItem.querySelector('span').textContent;
            const itemSize = cartItem.querySelectorAll('span')[1].textContent.split(': ')[1];
            return itemName === item.name && itemSize === selectedSize;
        });

        if (existingCartItem) {
            const existingQuantity = parseInt(existingCartItem.querySelectorAll('span')[2].textContent.split(': ')[1]);
            const newQuantity = existingQuantity + selectedQuantity;
            const newTotalPrice = (parseFloat(item.price.replace('$', '')) * newQuantity).toFixed(2);
    
            existingCartItem.querySelectorAll('span')[2].textContent = `Quantity: ${newQuantity}`;
            existingCartItem.querySelectorAll('span')[3].textContent = `$${newTotalPrice}`;
        } else {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <span>Size: ${selectedSize}</span>
                <span>Quantity: ${selectedQuantity}</span>
                <span>$${totalPrice}</span>
                <span class="remove-item">Remove</span>
            `;
 
        
         const removeButton = cartItem.querySelector('.remove-item');
         removeButton.addEventListener('click', () => {
             cartItem.remove();
             updateCartBadgeCount(dropdownCart.childElementCount);
             saveCartItemsToStorage(Array.from(dropdownCart.children))
         });
        
         dropdownCart.appendChild(cartItem);
        }
        
         // Display dropdown cart on hover
        dropdownCart.style.display = 'block';

        // Hide the dropdown when mouse leaves the cart icon
        dropdownCart.addEventListener('mouseleave', () => {
        dropdownCart.style.display = 'none';
        });

        // Update cart badge count
        updateCartBadgeCount(dropdownCart.childElementCount);

        // Save cart items to local storage
        saveCartItemsToStorage(Array.from(dropdownCart.children));
        
     }
 

     const addToCartButton = document.querySelector('.single-pro-details button');
     addToCartButton.addEventListener('click', () => {

         const productName = document.querySelector('.single-pro-details h4').textContent;
         const productPrice = document.querySelector('.single-pro-details h2').textContent;
         const productImage = document.querySelector('.single-pro-image img').src;
 
         
         const product = {
             name: productName,
             price: productPrice,
             image: productImage
         };
 
    
         addToCart(product);
     });

    } catch (error) {
        console.error('Error:', error);
    }
});


