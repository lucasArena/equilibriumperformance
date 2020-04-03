import Sequelize, { Model } from 'sequelize';

class Workout extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        sequence: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.WorkoutExercise, {
      as: 'exercises',
    });

    this.belongsTo(models.Band, {
      foreignKey: 'band_id',
      as: 'band',
    });
  }
}

export default Workout;
