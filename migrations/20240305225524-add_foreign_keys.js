'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'customerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Customer',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('order_details', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Add foreign key for Product ID
    await queryInterface.addColumn('order_details', 'productId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'customerId');
    await queryInterface.removeColumn('order_details', 'orderId');
    await queryInterface.removeColumn('order_details', 'productId');
  }
};
