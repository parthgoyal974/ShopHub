// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//     up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn('users', 'verified', {
//       type: Sequelize.BOOLEAN,
//       allowNull: false,
//       defaultValue: false
//     });
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeColumn('users', 'verified');
//   }

// };
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // name of Target model
          key: 'id',      // key in Target model
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'completed',
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
    await queryInterface.dropTable('orders');
  }
};
