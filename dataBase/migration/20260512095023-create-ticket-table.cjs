'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
        id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      ticket_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("open", "in_progress", "closed"),
        defaultValue: "open",
      },

      priority: {
        type: Sequelize.ENUM("low", "medium", "high"),
        defaultValue: "low",
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

      current_Agent: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      resolve_At: {
        type: Sequelize.DATE,
      },

      close_At: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('tickets');
  }
};
