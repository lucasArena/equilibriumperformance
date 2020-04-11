import * as Yup from 'yup';

import StudentWorkout from '../models/StudentWorkout';
import Student from '../models/Student';
import Band from '../models/Band';
import Workout from '../models/Workout';
import Exercise from '../models/Exercise';
import Category from '../models/Category';
import WorkoutExercise from '../models/WorkoutExercise';

class StudentWorkoutController {
  async index(req, res) {
    const { studentNick } = req.params;

    const student = await Student.findOne({ where: { nickname: studentNick } });

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const [workouts, finishWorkouts, studentInfo] = await Promise.all([
      Workout.findAll({
        include: [
          {
            model: WorkoutExercise,
            as: 'exercises',
            include: [
              {
                model: Exercise,
                as: 'exercise',
                include: [
                  {
                    model: Category,
                    as: 'category',
                  },
                ],
              },
            ],
          },
          {
            model: Band,
            as: 'band',
            attributes: ['id', 'name', 'color'],
          },
        ],
      }),
      StudentWorkout.findAll({ where: { student_id: student.id } }),
      Student.findByPk(student.id, {
        include: [
          {
            model: Band,
            as: 'band',
            attributes: ['name', 'color'],
          },
        ],
        attributes: ['id', 'name', 'band_id'],
      }),
    ]);

    const formattedWorkouts = workouts.map((workout) => {
      const finished = !!finishWorkouts.some(
        (w) => w.workout_id === workout.id
      );

      return {
        workout,
        current: finished,
        finished,
      };
    });

    return res.json({ studentInfo, workouts: formattedWorkouts });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      workout_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const { student_id, workout_id } = req.body;

    const [student, workout] = await Promise.all([
      Student.findByPk(student_id),
      Workout.findByPk(workout_id),
    ]);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    if (!workout) {
      return res.status(400).json({ error: 'Workout does not exists' });
    }

    const student_workout = await StudentWorkout.create({
      student_id,
      workout_id,
    });

    return res.json(student_workout);
  }
}

export default new StudentWorkoutController();
