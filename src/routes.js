import express from 'express';

import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import BandController from './app/controllers/BandController';
import SessionController from './app/controllers/SessionController';
import ExerciseController from './app/controllers/ExerciseController';
import WorkoutController from './app/controllers/WorkoutController';
import WorkoutExerciseController from './app/controllers/WorkoutExerciseController';
import StudentWorkoutController from './app/controllers/StudentWorkoutController';

import authMiddleware from './app/middlewares/auth';

const router = express();

router.post('/sessions', SessionController.store);

router.use(authMiddleware);

router.post('/users', UserController.store);

router.get('/students', StudentController.index);
router.post('/students', StudentController.store);
router.put('/students/:id', StudentController.update);
router.delete('/students/:id', StudentController.delete);

router.post('/bands', BandController.store);

router.get('/exercises', ExerciseController.index);
router.post('/exercises', ExerciseController.store);
router.get('/exercises/:id', ExerciseController.find);
router.put('/exercises/:id', ExerciseController.update);
router.delete('/exercises/:id', ExerciseController.delete);

router.get('/workouts', WorkoutController.index);
router.post('/workouts', WorkoutController.store);
router.get('/workouts/:id', WorkoutController.find);
router.put('/workouts/:id', WorkoutController.update);

router.delete('/workout/exercise/:id', WorkoutExerciseController.delete);

router.get('/student/:studentNick/workouts', StudentWorkoutController.index);
router.post('/student/workout/finish', StudentWorkoutController.store);

export default router;
