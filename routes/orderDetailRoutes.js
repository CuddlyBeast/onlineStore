const express = require("express");
const { OrderDetail } = require("../models");
const { authenticateCustomer } = require("../middleware/authenticationMiddleware")

const router = express.Router();

// Add a new order detail to an order will be called multiple times
router.post("/order/:id/details", authenticateCustomer, async (req, res) => {
    try {
        const { productId, quantity, price, paymentMethod } = req.body; 
        const orderId = req.params;
        

        const newOrderDetails = await OrderDetail.create({
            orderId: orderId,
            productId,
            quantity,
            price,
            paymentMethod,
        });

        res.send({
            message: "Product details added to order successful",
            Details: {
            id: newOrderDetails.id,
            orderId: newOrderDetails.orderId,
            productId: newOrderDetails.productId,
            quantity: newOrderDetails.quantity,
            price: newOrderDetails.price,
            paymentMethod: newOrderDetails.paymentMethod,
            }
        })

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;