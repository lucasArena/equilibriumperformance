module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'bands',
      [
        {
          name: 'Branca',
          color: '#FFF',
          sequence: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Amarela',
          color: 'yellow',
          sequence: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('bands', null, {});
  },
};
