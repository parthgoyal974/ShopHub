module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('otps', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      email: { type: Sequelize.STRING, allowNull: false },
      otp: { type: Sequelize.STRING, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('otps');
  }
};
