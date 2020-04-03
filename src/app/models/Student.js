import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        nickname: Sequelize.STRING,
        email: Sequelize.STRING,
        birth: Sequelize.DATEONLY,
      },
      { sequelize, paranoid: true }
    );

    return this;
  }

  static associate(models) {
    return this.belongsTo(models.Band, {
      foreignKey: 'band_id',
      as: 'band',
    });
  }
}

export default Student;
