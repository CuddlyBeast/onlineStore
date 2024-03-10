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
    try {
        const response = await fetch('http://localhost:3000/cuddy/products');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        displayTableServiceData(data);
    
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
        <div class="pro">
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
    }
    if (item.category === "new arrivals") {
        newArrivalsHtml += `
        <div class="pro">
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
    }
    });

    productContainer.innerHTML = featuredProductsHtml;
    document.querySelector('.pro-container').innerHTML = featuredProductsHtml;

    document.getElementById("new-arrivals").innerHTML = newArrivalsHtml;
    
    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', () => {
            window.location.href = '/product';
        });
    });

}

// document.querySelectorAll('.add-to-cart').forEach(button => {
//     button.addEventListener('click', () => {
//         addToCart(button);
//     });
// });

// // Toggle cart visibility
// document.getElementById('cartToggleBtn').addEventListener('click', function() {
//     document.getElementById('cartContent').classList.toggle('show');
// });

// // Dummy function to add items to cart
// function addItemToCart(itemName) {
//     var cartContent = document.getElementById('cartContent');
//     var cartItem = document.createElement('div');
//     cartItem.classList.add('cart-item');
//     cartItem.textContent = itemName;
//     cartContent.appendChild(cartItem);

//     // Update cart badge count
//     var badge = document.querySelector('.badge');
//     badge.textContent = parseInt(badge.textContent) + 1;
// }