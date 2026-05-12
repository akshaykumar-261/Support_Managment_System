'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ticketHistories', {
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

      assign_From: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      assign_To: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      assign_By: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable('ticketHistories');
  }
};
