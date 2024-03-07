const express = require("express");
const router = express.Router();

const { Product } = require("../models");

// View All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.send(products)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
});

// View Specific Product
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ where: {id: productId}});
    res.send(product)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
});

// Admin: Create a New Product
router.post("/product", async (req, res) => {
  try {
      const { name, description, price,	category,	size,	color, quantity, image } = req.body;

      const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        size,
        color,
        quantity,
        image
      })

      res.send({
        message: "Product creation successful",
        Product: {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        size: newProduct.size,
        color: newProduct.color,
        quantity: newProduct.quantity,
        image: newProduct.image,
        }
      })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});

// Admin: Update a Product's information
router.put("/product/:id", async (req, res) => {
  try {
      
      const { name, description, price,	category,	size,	color, quantity, image } = req.body
      const productId = req.params;

      const newProduct = await Product.update({
        name,
        description,
        price,
        category,
        size,
        color,
        quantity,
        image
      }, {
        where: {
         id: productId 
        },
        returning: true
      })

      res.send({
        message: "Product Updated!",
        Product: {
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          size: newProduct.size,
          color: newProduct.color,
          quantity: newProduct.quantity,
          image: newProduct.image,
          }
      })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});

// Admin: Delete Product
router.delete("/product/:id", async (req, res) => {
  try {
      const productId = req.params;
      
      if (!validator.isInt(order, { min: 1 })) {
        return res.status(400).send({ error: 'Invalid order ID must be a positive integer'});
      }
      
      Product.destroy({ where: { id: productId } })

      res.send({ message: `Product with ID:${productId} has been deleted.` })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});


  module.exports = router