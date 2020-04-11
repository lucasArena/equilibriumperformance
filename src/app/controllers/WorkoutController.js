import * as Yup from 'yup';
import { Op } from 'sequelize';

import Workout from '../models/Workout';
import WorkoutExercise from '../models/WorkoutExercise';
import Exercise from '../models/Exercise';
import Band from '../models/Band';

class WorkoutController {
  async index(req, res) {
    const schema = Yup.object().shape({
      limit: Yup.number(),
      offset: Yup.number(),
      filter: Yup.string(),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { offset = 1, limit = 5, filter = '' } = req.query;

    const workouts = await Workout.findAll({
      include: [
        {
          model: WorkoutExercise,
          as: 'exercises',
          include: [
            {
              model: Exercise,
              as: 'exercise',
            },
          ],
          order: ['createdAt', 'ASC'],
        },
      ],
      limit,
      offset: (offset - 1) * limit,
      where: {
        [Op.or]: [
          {
            description: {
              [Op.like]: `%${filter}%`,
            },
          },
        ],
      },
    });

    const count = await Workout.count({
      where: {
        [Op.or]: [
          {
            description: {
              [Op.like]: `%${filter}%`,
            },
          },
        ],
      },
    });

    res.header('X-TOTAL-COUNT', workouts.length);

    return res.json({ count, workouts });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      sequence: Yup.string().required(),
      band_id: Yup.number().required(),
      exercises: Yup.array().of(
        Yup.object().shape({
          exercise_id: Yup.string().required(),
          repetitions: Yup.string().required(),
          series: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const { description, sequence, band_id, exercises } = req.body;

    const bandExists = await Band.findByPk(band_id);

    if (!bandExists) {
      return res.status(400).json({ error: 'Band does not exists' });
    }

    const savedExercises = await Exercise.findAll();

    const exerciseNotExist = exercises.filter(
      (exercise) =>
        !savedExercises.some((e) => e.id === Number(exercise.exercise_id))
    );

    if (exerciseNotExist.length) {
      return res
        .status(400)
        .json({ error: 'One of the exercises does not exists' });
    }

    const workout = await Workout.create(
      {
        description,
        sequence,
        exercises,
        band_id,
      },
      {
        include: [
          {
            model: WorkoutExercise,
            as: 'exercises',
          },
        ],
      }
    );

    return res.json(workout);
  }

  async find(req, res) {
    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { id } = req.params;

    const workout = await Workout.findByPk(id, {
      include: {
        model: WorkoutExercise,
        as: 'exercises',
      },
    });

    if (!workout) {
      return res.status(400).json({ error: 'Workout does not exists' });
    }

    return res.json(workout);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      sequence: Yup.string().required(),
      band_id: Yup.string().required(),
      exercises: Yup.array().of(
        Yup.object().shape({
          id: Yup.string(),
          exercise_id: Yup.string().required(),
          repetitions: Yup.string().required(),
          series: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { id } = req.params;
    const { description, sequence, band_id, exercises } = req.body;

    const bandExists = await Band.findByPk(band_id);

    if (!bandExists) {
      return res.status(400).json({ error: 'Band does not exists' });
    }

    const workout = await Workout.findByPk(id);

    if (!workout) {
      return res.status(400).json({ error: 'Workout does not exists' });
    }

    const savedExercises = await Exercise.findAll();

    const exerciseNotExist = exercises.filter(
      (exercise) =>
        !savedExercises.some((e) => e.id === Number(exercise.exercise_id))
    );

    if (exerciseNotExist.length) {
      return res
        .status(400)
        .json({ error: 'One of the exercises does not exists' });
    }

    await workout.update({
      description,
      sequence,
      band_id,
    });

    const updatedExercises = await Promise.all(
      exercises.map(
        async ({ id: idWorkoutExercise, exercise_id, repetitions, series }) => {
          const [exercise] = await WorkoutExercise.upsert(
            {
              id: idWorkoutExercise,
              exercise_id,
              workout_id: workout.id,
              repetitions,
              series,
            },
            {
              returning: true,
            }
          );
          return exercise;
        }
      )
    );

    const response = {
      description,
      sequence,
      band_id,
      exercises: updatedExercises,
    };

    return res.json(response);
  }
}

export default new WorkoutController();
