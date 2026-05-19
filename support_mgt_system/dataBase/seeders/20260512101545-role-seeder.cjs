module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Super Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Agent',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name:'Customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
