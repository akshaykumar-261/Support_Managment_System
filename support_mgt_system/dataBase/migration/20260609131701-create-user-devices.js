'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_devices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // your users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      device_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      device_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      device_type: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 1,
        comment: '1 = android, 2 = ios, 3 = web',
      },

      is_login: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      login_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      logout_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_devices');
  }
};