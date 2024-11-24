import express from 'express';
import { usersController } from '../controllers/users';

const userRoutes = express.Router();

userRoutes.post('/', usersController.createValidation, usersController.create as express.RequestHandler);
userRoutes.post('/signIn', usersController.signInValidation, usersController.signIn as express.RequestHandler);

export { userRoutes }
