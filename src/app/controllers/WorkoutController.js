import * as Yup from 'yup';

import Workout from '../models/Workout';
import WorkoutExercise from '../models/WorkoutExercise';
import Exercise from '../models/Exercise';

class WorkoutController {
  async index(req, res) {
    const workout = await Workout.findAll({
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
        },
      ],
    });

    return res.json(workout);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      sequence: Yup.string().required(),
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

    const { description, sequence, exercises } = req.body;

    const savedExercises = await Exercise.findAll();

    const exerciseNotExist = exercises.filter(
      (exercise) => !savedExercises.some((e) => e.id === exercise.exercise_id)
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
      exercises: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required(),
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
    const { description, sequence, exercises } = req.body;

    const workout = await Workout.findByPk(id);

    if (!workout) {
      return res.status(400).json({ error: 'Workout does not exists' });
    }

    const savedExercises = await Exercise.findAll();

    const exerciseNotExist = exercises.filter(
      (exercise) => !savedExercises.some((e) => e.id === exercise.exercise_id)
    );

    if (exerciseNotExist.length) {
      return res
        .status(400)
        .json({ error: 'One of the exercises does not exists' });
    }

    await workout.update({
      description,
      sequence,
    });

    const updatedExercises = await Promise.all(
      exercises.map(
        async ({ id: workout_id, exercise_id, repetitions, series }) => {
          const exercise = await WorkoutExercise.findByPk(workout_id);
          const response = await exercise.update(
            {
              exercise_id,
              repetitions,
              series,
            },
            { new: true }
          );

          return response;
        }
      )
    );

    const response = {
      description,
      sequence,
      exercises: updatedExercises,
    };

    return res.json(response);
  }
}

export default new WorkoutController();
