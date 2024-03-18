let totalPrice;
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

document.addEventListener('DOMContentLoaded', function() {
    const cartTotal = JSON.parse(localStorage.getItem('cartTotal'));
    const discount = JSON.parse(localStorage.getItem('discount')) || 0;

    let subtotal = cartTotal.subtotal;
    let deliveryCost = calculateDeliveryCost('Standard'); 
    totalPrice = subtotal - discount + deliveryCost;

    cartItems.forEach(item => {
        const imgSrc = item.image;
        const name = item.name;
        const price = parseFloat(item.price.slice(1)); 
        const quantity = item.quantity;
        const returnPrice = price * quantity;


        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${imgSrc}" alt="">
            <div class="info">
                <div class="name">${name}</div>
                <div class="price">${price}</div>
            </div>
            <div class="quantity">${quantity}</div>
            <div class="returnPrice">${returnPrice.toFixed(2)}</div>
        `;

        document.querySelector('.list').appendChild(itemElement);
    });

    updateTotal(subtotal, discount, totalPrice); 

    const deliveryTypeSelect = document.getElementById('deliveryType');
    deliveryTypeSelect.addEventListener('change', function() {
        const deliveryCost = calculateDeliveryCost(deliveryTypeSelect.value);
        const totalPrice = subtotal - discount + deliveryCost;
        updateTotal(subtotal, discount, totalPrice);

        const deliveryRowTotalPrice = document.querySelector('.return .row:nth-child(2) .totalPrice');
        deliveryRowTotalPrice.textContent = deliveryCost === 0 ? 'Free' : `$${deliveryCost.toFixed(2)}`;
    });
});

function calculateDeliveryCost(deliveryType) {
    if (deliveryType === 'Standard') {
        return 0;
    } else if (deliveryType === 'Next Day') {
        return 5.95;
    } else if (deliveryType === 'Instant') {
        return 7.95;
    }
    return 0; 
}

function updateTotal(subtotal, discount, totalPrice) {
    document.querySelector('.return .row:nth-child(1) .totalPrice').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.return .row:nth-child(3) .totalPrice').textContent = `$${discount.toFixed(2)}`;
    document.querySelector('.return .row:nth-child(4) .totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}




// Form Info For Placing Order with Order Details
document.querySelector('.buttonCheckout').addEventListener('click', async function() {
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const postcode = document.getElementById('postcode').value;
    const deliveryType = document.getElementById('deliveryType').value;
  
    const cardNumber = document.querySelector('.card-number-input').value;
    

    const orderData = {
        totalAmount: totalPrice, 
        orderStatus: 'pending', 
        paymentInformation: cardNumber,
        deliveryType,
        address,
        city,
        postcode,
        country
    };
    console.log(orderData)

    try {
        const orderResponse = await submitOrder(orderData);
        const orderId = orderResponse.Order.id;
        await addOrderDetails(orderId, cartItems);
        window.location.href = "/"
    } catch (error) {
        console.error('Error', error);
    }
});






async function submitOrder(orderData) {
    const token = localStorage.getItem('token');

    console.log(token)

    try {
        const response = await fetch('http://localhost:3000/cuddy/order', {
            method: 'POST',
            body: JSON.stringify(orderData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to submit order');
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error submitting order:', error);
    }
}

async function addOrderDetails(orderId, orderDetails) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/cuddy/order/${orderId}/details`, {
            method: 'POST',
            body: JSON.stringify(orderDetails),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to add order details');
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error adding order details:', error);
    }
}