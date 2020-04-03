module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'categories',
      [
        {
          name: 'Costas',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Peito',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Perna',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Bicipes',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Tricipes',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Ombro',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Abdomên',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
