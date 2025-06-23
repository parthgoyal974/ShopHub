// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('otps', {
//       id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
//       email: { type: Sequelize.STRING, allowNull: false },
//       otp: { type: Sequelize.STRING, allowNull: false },
//       expiresAt: { type: Sequelize.DATE, allowNull: false },
//       createdAt: Sequelize.DATE,
//       updatedAt: Sequelize.DATE
//     });
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('otps');
//   }
// };



'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderItems', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orderItems');
  }
};



