const productContainer = document.querySelector('.pro-container');

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

   
    data.forEach(item => {
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
    });

    productContainer.innerHTML = featuredProductsHtml;
    document.querySelector('.pro-container').innerHTML = featuredProductsHtml;
    
    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', () => {
            window.location.href = '/product';
        });
    });

}