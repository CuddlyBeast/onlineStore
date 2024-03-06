const express = require("express");
const router = express.Router();

const { Product } = require("../models");

router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.send(products)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ where: {id: productId}});
    res.send(product)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
})



  module.exports = router