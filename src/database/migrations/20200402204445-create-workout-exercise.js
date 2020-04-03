module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('workout_exercises', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      exercise_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'exercises',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      workout_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'workouts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      repetitions: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      series: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('workout_exercises');
  },
};
