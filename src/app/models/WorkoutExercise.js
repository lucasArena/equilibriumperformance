import Sequelize, { Model } from 'sequelize';

class WorkoutExercise extends Model {
  static init(sequelize) {
    super.init(
      {
        repetitions: Sequelize.STRING,
        series: Sequelize.INTEGER,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Exercise, {
      foreignKey: 'exercise_id',
      as: 'exercise',
    });

    this.belongsTo(models.Workout, {
      foreignKey: 'workout_id',
      as: 'workouts',
    });
  }
}

export default WorkoutExercise;
