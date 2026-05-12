'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ticketMessages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      ticket_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tickets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      sender_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      attachment_Url: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('ticketMessages');
  }
};
