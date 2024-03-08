'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Product, { foreignKey: 'customerId' });
    }
  }
  Order.init({
    customerId: DataTypes.INTEGER,
    totalAmount: DataTypes.DECIMAL,
    orderStatus: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
    timestamps: true,
  });
  return Order;
};