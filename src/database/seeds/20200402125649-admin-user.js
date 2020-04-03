const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Admin EP',
          email: 'equilibriumperfomance@gmail.com',
          password_hash: bcrypt.hashSync('123456', 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Lucas Arena',
          email: 'lucasarenasantos@gmail.com',
          password_hash: bcrypt.hashSync('123456', 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
