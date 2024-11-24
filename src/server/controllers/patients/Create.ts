import { IUser } from "../../database/models/User";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { Request, Response } from "express";
import { IPatient } from "../../database/models/Patient";
import { PatientsProvider } from "../../database/providers/patients";

interface IBodyProps extends Omit<IPatient, 'id'> { }

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object<IBodyProps>().shape({
        full_name: yup.string().required().max(255),
        birthdate: yup.string().required(),
        ssn: yup.string().required().max(255),
        contact_number: yup.string().required(),
        email: yup.string().required().email(),
        medical_history: yup.string().required(),
        address: yup.string().required(),
        gender: yup.string().required(),
        has_insurance: yup.boolean().required(),
        insurance_carrier: yup.string().optional().nullable(),
        user_id: yup.string().required(),
        created_at: yup.string().optional(),
        updated_at: yup.string().optional(),
        profile_picture_url: yup.string().optional(),
    }))
}));

export const create = async (req:Request<{}, {}, IPatient>, res: Response) => {
    const result = await PatientsProvider.create(req.body);

    if (result instanceof Error){
        return res.status(500).json({
            errors: {
                default: result.message,
                human_error: 'Error providing new user'
            }
        });
    }
    res.status(201).json(result)
};