module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'band_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'bands',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('students', 'band_id');
  },
};
