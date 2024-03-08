const jwt = require('jsonwebtoken');
const { Customer } = require('../models');

const authenticateCustomer = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');


  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const decodedToken = jwt.verify(token, 'ssfdsfhccrthghafdethgv');
    const customer = await Customer.findByPk(decodedToken.id); 
  

    if (!customer) {
      return res.status(401).json({ error: 'Unauthorized - Invalid customer' });
    }

    req.customer = customer;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = { authenticateCustomer };
