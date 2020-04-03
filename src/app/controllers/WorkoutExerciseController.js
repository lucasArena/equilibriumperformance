import * as Yup from 'yup';

import WorkoutExercise from '../models/WorkoutExercise';

class WorkoutExerciseController {
  async delete(req, res) {
    const { id } = req.params;

    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const workoutExercise = await WorkoutExercise.findByPk(id);

    if (!workoutExercise) {
      return res
        .status(400)
        .json({ error: 'Exercise of workout does not exists' });
    }

    await workoutExercise.destroy(id);

    return res.json(workoutExercise);
  }
}

export default new WorkoutExerciseController();
