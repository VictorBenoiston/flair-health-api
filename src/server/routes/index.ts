import { NextFunction, Request, Response, Router } from 'express'
import { userRoutes } from './userRoutes';
import { patienRoutes } from './patientRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/patients', patienRoutes);

export { router };
