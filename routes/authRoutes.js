const express = require("express");
const jwt = require('jsonwebtoken');
const { Customer } = require('../models');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { authenticateCustomer } = require("../middleware/authenticationMiddleware");
const { isAdmin } = require("../middleware/isAdminMiddleware");

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

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
      mobile,
      email,
      password: hashedPassword,
    });

    res.send({
      message: 'Customer successfully registered',
      Customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        mobile: newCustomer.mobile,
        email: newCustomer.email,
      },
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(401).send({ error: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: customer.id }, 'ssfdsfhccrthghafdethgv', { expiresIn: '1h' });

    res.send({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.log(error)
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
router.get('/customers', isAdmin, async (req, res) => {
  try {
    const customers = await Customer.findAll()
    res.status(200).send(customers)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
});

// Admin: Get Customer by ID
router.get('/customers/:id', isAdmin, async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOne({ where: { id: customerId } });
    res.status(200).send(customer)
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error"})
  }
});

// Profile~ Update Customer Information
router.put("/profile", authenticateCustomer,  async (req, res) => {
  try {
      
      const { name,	email, address, mobile } = req.body
      const customerId = req.customer.id;

      const [rowsAffected, [updatedCustomer]] = await Customer.update({
        name,
        email,
        address,
        mobile,
      }, {
        where: {
         id: customerId 
        },
        returning: true
      })

      if (rowsAffected === 0) {
        return res.status(404).send({ error: "Customer not found" });
      }

      res.send({
        message: "Customer Information Updated!",
        Customer: updatedCustomer
      })
  } catch (error) {
      res.status(500).send({ error: "Internal Server Error" })
  }
});

// Profile~ Delete Own Profile
router.delete("/profile", authenticateCustomer, async (req, res) => {
  try {
      const customerId = req.customer.id.toString();
      
      if (!validator.isInt(customerId, { min: 1 })) {
        return res.status(400).send({ error: 'Invalid customer ID. Must be a positive integer'});
      }
      
      Customer.destroy({ where: { id: customerId } })

      res.send({ message: `Customer with Id: ${customerId} has been deleted.` })
  } catch (error) {
    console.log(error)
      res.status(500).send({ error: "Internal Server Error" })
  }
});

module.exports = router;









