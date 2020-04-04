import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Band from '../app/models/Band';
import Category from '../app/models/Category';
import Exercise from '../app/models/Exercise';
import Workout from '../app/models/Workout';
import WorkoutExercise from '../app/models/WorkoutExercise';
import StudentWorkout from '../app/models/StudentWorkout';

const models = [
  User,
  Student,
  Band,
  Category,
  Exercise,
  Workout,
  WorkoutExercise,
  StudentWorkout,
];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);
    this.init();
  }

  init() {
    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
