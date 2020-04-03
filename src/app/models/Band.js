import Sequelize, { Model } from 'sequelize';

class Band extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        color: Sequelize.STRING,
        sequence: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}

export default Band;
