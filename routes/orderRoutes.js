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
            customerId: customerId,
            totalAmount,
            orderStatus,
        });

        res.send({
            message: "Order successful",
            Order: {
            id: newOrder.id,
            customerId: newOrder.customerId,
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

// Order History~ View All Orders for a Specific Customer
router.get("/order/history", authenticateCustomer, async (req, res) => {
    try {
        const customerId = req.customer.id;
        const orders = await Order.findAll({ where: { customerId: customerId } });
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// Order History~ Delete Specific Order During Grace Period
router.delete("/order/:id", authenticateCustomer, async (req, res) => {
    try {
        const order = req.params.id;
        const customerId = req.customer.id

        if (!validator.isInt(customerId, { min: 1 })) {
            return res.status(400).send({ error: 'Invalid customer ID. Must be a positive integer'});
          }
        
        Order.destroy({ where: { customerId: customerId, id: order }});
        res.send({ message: `Order number ${order} has been deleted.`});
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
})

// Order History~ Update Order Information (Change Status)
router.put("/order/:id", authenticateCustomer,  async (req, res) => {
    try {
        
        const { orderStatus } = req.body
        const customerId = req.customer.id;
        
        // Or const [_, [updatedOrder]] instead of newOrder to show all of the order info to user in response. _ placeholder to ignore the number of rows affected from the destructured Order.update
        const newOrder = await Order.update({
        orderStatus
        }, {
          where: {
           id: customerId 
          },
          returning: true
        })
  
        res.send({
          message: "Order Information Updated!",
          Order: {
            orderStatus: newOrder.orderStatus
            }
        })
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
  });

module.exports = router;