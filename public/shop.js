const productContainer = document.querySelector('.pro-container');
const paginationContainer = document.getElementById('pagination');
let currentPage = 1;
let data = [];
let cartItems = [];

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


    cartItems = getCartItemsFromStorage();
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



function filterProducts() {
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const brand = document.getElementById('brand').value;

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

    currentPage = 1;
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
            <a href="#"><i class='bx bx-heart cart'></i></a>
        </div>`;
    });

    productContainer.innerHTML = featuredProductsHtml;
    document.querySelector('.pro-container').innerHTML = featuredProductsHtml;

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(data.length / itemsPerPage);

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