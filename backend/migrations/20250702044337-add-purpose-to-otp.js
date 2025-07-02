'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('otps', 'purpose', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'verification'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('otps', 'purpose');
  }
};
