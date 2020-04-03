import * as Yup from 'yup';

import Exercise from '../models/Exercise';
import Category from '../models/Category';

class ExerciseController {
  async index(req, res) {
    const exercises = await Exercise.findAll();
    return res.json(exercises);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      category_id: Yup.number().required(),
    });

    const { name, category_id } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const categoryExists = await Category.findByPk(category_id);

    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exists' });
    }

    const exercise = await Exercise.create({
      name,
      category_id,
    });

    return res.json(exercise);
  }

  async find(req, res) {
    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { id } = req.params;

    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(400).json({ error: 'Exercise does not exists' });
    }

    return res.json(exercise);
  }

  async update(req, res) {
    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      category_id: Yup.number().required(),
    });

    const { id } = req.params;

    const { name, category_id } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const categoryExists = await Category.findByPk(category_id);

    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exists' });
    }

    const exercise = await Exercise.findByPk(id);

    await exercise.update(
      {
        name,
        category_id,
      },
      { new: true }
    );

    return res.json(exercise);
  }

  async delete(req, res) {
    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { id } = req.params;

    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(400).json({ error: 'Exercise does not exits' });
    }

    exercise.destroy(id);

    return res.json(exercise);
  }
}

export default new ExerciseController();
