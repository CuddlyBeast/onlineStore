const express = require("express");
const jwt = require('jsonwebtoken');
const { Customer } = require('../models');
const bcrypt = require('bcrypt');
const validator = require('validator');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, mobile, address, email, password, payment_method } = req.body;

    const validationOptions = {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumber: 1,
      minSymbols:0,
      returnScore: false,
    };

    if (!validator.isStrongPassword(password, validationOptions)) {
      return res.status(400).json({ error: 'Weak password. Must be at least 8 characters long including lowercase, uppercase, and numeric values.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await Customer.create({
      name,
      mobile,
      address,
      email,
      password: hashedPassword,
      payment_method,
      updated_at: new Date(),
    });

    res.json({
      message: 'Customer successfully registered',
      Customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        mobile: newCustomer.mobile,
        address: newCustomer.address,
        email: newCustomer.email,
        payment_method: newCustomer.payment_method,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const Customer = await Customer.findOne({ where: { email } });

    if (!Customer) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, Customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: Customer.id }, 'hkdlspairjtmchswgqusdfpgkwpdfu', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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



module.exports = router;









