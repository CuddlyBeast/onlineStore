const express = require("express");
const router = express.Router();
const validator = require("validator");

const { Product } = require("../models");
const { isAdmin } = require("../middleware/isAdminMiddleware");

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
router.post("/product", isAdmin, async (req, res) => {
  try {
      const { name, description, price,	category, type, image, brand } = req.body;


      const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        type,
        image,
        brand
      })


      res.status(201).send({
        message: "Product creation successful",
        Product: {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        type: newProduct.type,
        image: newProduct.image,
        brand: newProduct.brand,
        }
      })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});

// Admin: Update a Product's information
router.put("/product/:id", isAdmin, async (req, res) => {
  try {
      
      const { name, description, price,	category, type, image, brand } = req.body
      const productId = req.params.id;

      const [rowsAffected, [updatedProduct]] = await Product.update({
        name,
        description,
        price,
        category,     
        type,
        image,
        brand
      }, {
        where: {
         id: productId 
        },
        returning: true
      })

      if (rowsAffected === 0) {
        res.status(404).send({ error: "Product Not Found" })
      }

      res.send({
        message: "Product Updated!",
        Product: updatedProduct
      })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});

// Admin: Delete Product
router.delete("/product/:id", isAdmin, async (req, res) => {
  try {
      const productId = req.params.id;
      
      if (!validator.isInt(productId, { min: 1 })) {
        return res.status(400).send({ error: 'Invalid product ID. Must be a positive integer'});
      }
      
      Product.destroy({ where: { id: productId } })

      res.send({ message: `Product with Id: ${productId} has been deleted.` })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});


  module.exports = router