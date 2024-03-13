const productContainer = document.querySelector('.pro-container');
const paginationContainer = document.getElementById('pagination');
let currentPage = 1;
let data = [];

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
        const response = await fetch('http://localhost:3000/cuddy/products');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        data = await response.json();

        displayTableServiceData(data);
    
    } catch (error) {
        console.error('Error:', error);
    }

    document.getElementById('category').addEventListener('change', filterProducts);
    document.getElementById('price').addEventListener('change', filterProducts);
    document.getElementById('brand').addEventListener('change', filterProducts);
});

function filterProducts() {
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const brand = document.getElementById('brand').value;

    // Apply filters
    filteredData = data.filter(item => {
        if (category !== 'all' && item.type !== category) {
            return false;
        }
        if (price !== 'all') {
            const itemPrice = parseFloat(item.price.replace('$', ''));
            switch (price) {
                case 'under25':
                    if (itemPrice > 25) return false;
                    break;
                case '25to50':
                    if (itemPrice < 25 || itemPrice > 50) return false;
                    break;
                case '50to100':
                    if (itemPrice < 50 || itemPrice > 100) return false;
                    break;
                case 'over100':
                    if (itemPrice < 100) return false;
                    break;
            }
        }
        if (brand !== 'all' && item.brand !== brand) {
            return false;
        }
        return true;
    });

    // Display filtered products
    currentPage = 1; // Reset pagination to first page
    displayTableServiceData(filteredData);
}

function displayTableServiceData(data) {
    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex)

    let featuredProductsHtml = '';
   
    currentItems.forEach(item => {
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
    });

    productContainer.innerHTML = featuredProductsHtml;
    document.querySelector('.pro-container').innerHTML = featuredProductsHtml;

      // Clear pagination links
    paginationContainer.innerHTML = '';

    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Create pagination links
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', () => {
            currentPage = i;
            displayTableServiceData(data);
        });
        paginationContainer.appendChild(pageLink);
    }

    // Disable or enable next page button based on current page
    const nextPageButton = document.createElement('a');
    nextPageButton.href = '#';
    nextPageButton.innerHTML = '<i class="bx bx-right-arrow-alt"></i>';
    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTableServiceData(data);
        }
    });
    paginationContainer.appendChild(nextPageButton);
    
    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', (event) => {
            event.preventDefault();

            const productId = product.dataset.id;

            window.location.href = `/product?id=${productId}`;
        });
    });

}