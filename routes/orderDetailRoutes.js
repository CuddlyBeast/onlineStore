const express = require("express");
const { OrderDetail } = require("../models");
const { authenticateCustomer } = require("../middleware/authenticationMiddleware")

const router = express.Router();

// Add a new order detail to an order will be called multiple times
router.post("/order/:id/details", authenticateCustomer, async (req, res) => {
    try {
        const { productId, quantity, price } = req.body; 
        const orderId = req.params.id;
        

        const newOrderDetails = await OrderDetail.create({
            orderId: orderId,
            productId,
            quantity,
            price,
        });

        res.send({
            message: "Product details added to order successful",
            Details: {
            id: newOrderDetails.id,
            orderId: newOrderDetails.orderId,
            productId: newOrderDetails.productId,
            quantity: newOrderDetails.quantity,
            price: newOrderDetails.price,
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// Order History~ Get All The Order Details For Each Individual Order To Populate The Page With Information (maybe they can click into order to get more info or a slider/read more function)
router.get("/order/:id/details", authenticateCustomer,  async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const orderDetails = await OrderDetail.findAll({ where: { orderId: orderId } });
        res.send(orderDetails);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
  });

module.exports = router;