const express = require("express");
const jwt = require('jsonwebtoken');
const { Customer } = require('../models');
const bcrypt = require('bcrypt');
const validator = require('validator');

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, phoneNumber, address, email, password, paymentInformation } = req.body;

    const validationOptions = {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumber: 1,
      minSymbols:0,
      returnScore: false,
    };

    if (!validator.isStrongPassword(password, validationOptions)) {
      return res.status(400).send({ error: 'Weak password. Must be at least 8 characters long including lowercase, uppercase, and numeric values.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await Customer.create({
      name,
      phoneNumber,
      address,
      email,
      password: hashedPassword,
      paymentInformation,
    });

    res.send({
      message: 'Customer successfully registered',
      Customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        phoneNumber: newCustomer.phoneNumber,
        address: newCustomer.address,
        email: newCustomer.email,
        paymentInformation: newCustomer.paymentInformation,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const Customer = await Customer.findOne({ where: { email } });

    if (!Customer) {
      return res.status(401).send({ error: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, Customer.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: Customer.id }, 'hkdlspairjtmchswgqusdfpgkwpdfu', { expiresIn: '1h' });

    res.send({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ error: 'Internal Server Error' });
      } else {
        res.status(200).send({ message: "Logout Successful" })
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Admin: Get All Customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll()
    res.status(200).send(customers)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
});

// Admin: Get Customer by ID
router.get('/customers/:id', async (req, res) => {
  try {
    const customerId = req.params;
    const customer = await Customer.findOne({ where: { id: customerId } });
    res.status(200).send(customer)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
});


module.exports = router;









