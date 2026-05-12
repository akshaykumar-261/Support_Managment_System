const bcrypt = require('bcrypt');
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash('admin123@', 10);
    await queryInterface.bulkInsert('users', [
    {
       name: 'Admin User',
       email: 'admin123@yopmail.com',
       password: hashPassword,
       phoneNo: '7632456862',
       address: '123 Main Street,Delhi',
       role_Id: 1,
       createdAt: new Date(),
       updatedAt: new Date()
     }
    ])
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
