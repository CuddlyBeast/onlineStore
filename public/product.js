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
                <option>Select Size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>XL</option>
                <option>XXL</option>
            </select>
            <input type="number" value="1">
            <button class="normal">Add To Cart</button>
            <h4>Product Details</h4>
            <span>${productData.description}</span>
        </div>
        `;


        const productContainer = document.getElementById('prodetails');
        productContainer.innerHTML = productHtml;

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
        if (!response.ok) {
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
                <a href="#"><i class='bx bx-cart-alt cart'></i></a>
            </div>`;
            count++;
        }
    })

    document.querySelector('.pro-container').innerHTML = featuredProductsHtml

    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', (event) => {
            event.preventDefault();

            const productId = product.dataset.id;

            window.location.href = `/product?id=${productId}`;
        });
    });


    } catch (error) {
        console.error('Error:', error);
    }
});


//     productContainer.innerHTML = featuredProductsHtml;
//     document.querySelector('.pro-container').innerHTML = featuredProductsHtml;

//     document.getElementById("new-arrivals").innerHTML = newArrivalsHtml;

// }
