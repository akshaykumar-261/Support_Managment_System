'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('users', 'otp_type', {
      type: Sequelize.ENUM('EMAIL_VERIFICATION', 'FORGOT_PASSWORD'),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'is_verified');
    await queryInterface.removeColumn('users', 'otp_type');
  }
};