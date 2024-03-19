const express = require("express");
const { Order } = require("../models");
const validator = require('validator');
const { authenticateCustomer } = require("../middleware/authenticationMiddleware");
const { isAdmin } = require("../middleware/isAdminMiddleware");

const router = express.Router();

// Place Order
router.post("/order", authenticateCustomer, async (req, res) => {
    try {
        const { totalAmount, orderStatus, paymentInformation, deliveryType, discount, address, city, postcode, country } = req.body; // Maybe make orderStatus default pending then after set time change
        const customerId = req.customer.id;
        

        const newOrder = await Order.create({
            customerId: customerId,
            totalAmount,
            orderStatus,
            paymentInformation,
            deliveryType,
            discount,
            address,
            city,
            postcode,
            country,
        });

        res.send({
            message: "Order successful",
            Order: {
            id: newOrder.id,
            customerId: newOrder.customerId,
            orderDate: newOrder.orderDate,
            totalAmount: newOrder.totalAmount,
            orderStatus: newOrder.orderStatus,
            paymentInformation: newOrder.paymentInformation,
            deliveryType: newOrder.deliveryType,
            discount: newOrder.discount,
            address: newOrder.address,
            city: newOrder.city,
            postcode: newOrder.postcode,
            country: newOrder.country,
            }
        })

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// Admin: View Every Order in the System
router.get("/orders", isAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// Admin: View a Specific Order by ID
router.get("/orders/:id", isAdmin, async (req, res) => {
    try {
        const orderId = req.params.id;
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

        if (!validator.isInt(order, { min: 1 })) {
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
        
        const { orderStatus } = req.body;
        const orderId = req.params.id;
        const customerId = req.customer.id;
        
        const [rowsAffected, [updatedOrder]] = await Order.update({
        orderStatus
        }, {
          where: {
            id: orderId,
            customerId: customerId
          },
          returning: true
        })

        if (rowsAffected === 0) {
            res.status(404).send({ error: "Order Not Found" })
        }
  
        res.send({
          message: "Order Information Updated!",
          Order: updatedOrder
        })
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
    }
  });

module.exports = router;