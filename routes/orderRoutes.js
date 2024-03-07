const express = require("express");
const { Order } = require("../models");
const validator = require('validator');
const { authenticateCustomer } = require("../middleware/authenticationMiddleware")

const router = express.Router();

// Place Order
router.post("/order", authenticateCustomer, async (req, res) => {
    try {
        const { totalAmount, orderStatus } = req.body; // Maybe make orderStatus default pending then after set time change
        const customerId = req.customer.id;
        

        const newOrder = await Order.create({
            customer_id: customerId,
            orderDate: new Date(),
            totalAmount,
            orderStatus,
        });

        res.send({
            message: "Order successful",
            Order: {
            id: newOrder.id,
            customer_id: newOrder.customerId,
            orderDate: newOrder.orderDate,
            totalAmount: newOrder.totalAmount,
            orderStatus: newOrder.orderStatus,
            }
        })

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// Admin: View Every Order in the System
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// Admin: View a Specific Order by ID
router.get("/orders/:id", authenticateCustomer, async (req, res) => {
    try {
        const orderId = req.params;
        const orders = await Order.findOne({ where: { id: orderId } });
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// View All Orders for a Specific Customer
router.get("/order/history", authenticateCustomer, async (req, res) => {
    try {
        const customerId = req.customer.id;
        const orders = await Order.findAll({ where: { customer_id: customerId } });
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// Delete Order
router.delete("/order/delete/:id", authenticateCustomer, async (req, res) => {
    try {
        const order = req.params.id;
        const customerId = req.customer.id

        if (!validator.isInt(order, { min: 1 })) {
            return res.status(400).send({ error: 'Invalid order ID'});
          }
        
        Order.destroy({ where: { customer_id: customerId }});
        res.send({ message: `Order number ${order} has been deleted.`});
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
})

module.exports = router;