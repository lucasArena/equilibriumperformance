import * as Yup from 'yup';

import StudentWorkout from '../models/StudentWorkout';
import Student from '../models/Student';
import Workout from '../models/Workout';
import WorkoutExercise from '../models/WorkoutExercise';

class StudentWorkoutController {
  async index(req, res) {
    const { studentNick } = req.params;

    const student = await Student.findOne({ where: { nickname: studentNick } });

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const [workouts, finishWorkouts] = await Promise.all([
      Workout.findAll({
        include: [
          {
            model: WorkoutExercise,
            as: 'exercises',
          },
        ],
      }),
      StudentWorkout.findAll({ where: { student_id: student.id } }),
    ]);

    const formattedWorkouts = workouts.map((workout) => ({
      workout,
      finished: !!finishWorkouts.some((w) => w.workout_id === workout.id),
    }));

    return res.json(formattedWorkouts);
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
