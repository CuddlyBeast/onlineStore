'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Order, { foreignKey: 'orderId' })
    }
  }
  Transaction.init({
    orderId: DataTypes.INTEGER,
    transactionDate: DataTypes.DATE,
    paymentMethod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return Transaction;
};