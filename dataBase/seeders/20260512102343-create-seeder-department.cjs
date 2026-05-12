module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments', [
      {
        name: 'Billing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Technical Support',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sales',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  }
};
