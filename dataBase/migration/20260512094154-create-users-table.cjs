'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
       id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      address: {
        type: Sequelize.STRING,
      },

      phoneNo: {
        type: Sequelize.STRING,
      },

      profile_Img: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      otp: {
        type: Sequelize.INTEGER,
      },

      refreshToken: {
        type: Sequelize.TEXT,
      },

      role_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      department_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: "departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('users');
  }
};
