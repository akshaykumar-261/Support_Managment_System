"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ticketHistories", "action", {
      type: Sequelize.ENUM(
        "created",
        "assigned",
        "reassigned",
        "status_changed",
        "priority_changed",
        "resolved",
        "closed",
        "reopened"
      ),
      allowNull: false,
      defaultValue: "created",
    });

    await queryInterface.addColumn("ticketHistories", "old_Status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("ticketHistories", "new_Status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("ticketHistories", "old_Priority", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("ticketHistories", "new_Priority", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("ticketHistories", "from_Department", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("ticketHistories", "to_Department", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("ticketHistories", "action_By", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ticketHistories", "action");

    await queryInterface.removeColumn("ticketHistories", "old_Status");

    await queryInterface.removeColumn("ticketHistories", "new_Status");

    await queryInterface.removeColumn("ticketHistories", "old_Priority");

    await queryInterface.removeColumn("ticketHistories", "new_Priority");

    await queryInterface.removeColumn("ticketHistories", "from_Department");

    await queryInterface.removeColumn("ticketHistories", "to_Department");

    await queryInterface.removeColumn("ticketHistories", "action_By");
  },
};