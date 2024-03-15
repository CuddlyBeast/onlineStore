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

    const mapIframe = document.createElement('iframe');
    mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2470.0391704655867!2d-1.263353923088802!3d51.75060729290687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876c6a580aad8f9%3A0xbf7a512fe5a34b01!2sZARA!5e0!3m2!1sen!2suk!4v1708454069254!5m2!1sen!2suk";
    mapIframe.width = "600";
    mapIframe.height = "450";
    mapIframe.style.border = "0";
    mapIframe.allowfullscreen = "";
    mapIframe.loading = "lazy";
    mapIframe.referrerpolicy = "no-referrer-when-downgrade";


    const mapContainer = document.querySelector('.map');
    mapContainer.appendChild(mapIframe);

    let formDetailsSection = ''



     formDetailsSection += `
        <form action="https://api.web3forms.com/submit" method="POST">
            <span>LEAVE A MESSAGE</span>
            <h2>We would love to hear from you</h2>
            <input type="hidden" name="access_key" value="f242d71e-a659-4ac4-baa9-c70ccd040c58">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <textarea name="message" id="" cols="30" rows="10" placeholder="Your Message"></textarea>
            <button type="submit" class="normal">Submit</button>
        </form>
        
        <div class="people">
            <div>
                <img src="img/people/1.png" alt="">
                <p><span>John Doe</span> Senior Marketing Manager <br> Phone: 44+ 01223 435426 <br>Email: pickme@gmail.com</p>
            </div>
            <div>
                <img src="img/people/2.png" alt="">
                <p><span>Dohn Joe</span> Senior Marketing Manager <br> Phone: 44+ 01223 435426 <br>Email: pickme@gmail.com</p>
            </div>
            <div>
                <img src="img/people/3.png" alt="">
                <p><span>Josephine Doe</span> Senior Marketing Manager <br> Phone: 44+ 01223 435426 <br>Email: pickme@gmail.com</p>
            </div>
        </div>
        
    `;

    document.getElementById('form-details').innerHTML = formDetailsSection;


    cartItems = getCartItemsFromStorage();
    displayCartItems(cartItems);
})



function displayCartItems(cartItems) {
const dropdownCart = document.querySelector('.dropdown-cart');
dropdownCart.innerHTML = ''; // Clear previous items
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

             // Retrieve cart items from localStorage
             let updatedCartItems = getCartItemsFromStorage();
            
             // Remove the item from the cart items array
             updatedCartItems = updatedCartItems.filter(cartItem => cartItem.name !== item.name || cartItem.size !== item.size);
             
             // Save updated cart items to localStorage
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
