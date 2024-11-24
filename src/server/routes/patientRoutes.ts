import express from 'express';
import { patientsController } from '../controllers/patients';

const patienRoutes = express.Router();

patienRoutes.post('/', patientsController.createValidation, patientsController.create as express.RequestHandler)
patienRoutes.get('/', patientsController.getAllValidation, patientsController.getAll as express.RequestHandler);
patienRoutes.delete('/:id', patientsController.deleteByIdValidation, patientsController.deleteById as express.RequestHandler);
patienRoutes.get('/profile-image', patientsController.getProfileImage as express.RequestHandler);
patienRoutes.put('/:id', patientsController.updateByIdValidation, patientsController.updateById as express.RequestHandler);

export { patienRoutes }
