import { IUser } from "../../database/models/User";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { Request, Response } from "express";
import { IPatient } from "../../database/models/Patient";
import { PatientsProvider } from "../../database/providers/patients";

interface IParamProps {
    id?: string;
}

interface IBodyProps extends Omit<IPatient, 'id'> { }

export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        full_name: yup.string().required().max(255),
        birthdate: yup.string().required(),
        ssn: yup.string().required().max(255),
        contact_number: yup.string().required(),
        email: yup.string().optional().email(),
        medical_history: yup.string().required(),
        address: yup.string().required(),
        gender: yup.string().required(),
        has_insurance: yup.boolean().required(),
        insurance_carrier: yup.string().optional().nullable(),
        user_id: yup.string().required(),
        created_at: yup.string().optional(),
        updated_at: yup.string().optional(),
        // profile_picture_url: yup.string().optional(),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.string().required(),
    })),
}));



export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    const body = req.body
    const patient_id = req.params.id

    if (!patient_id) {
        return res.status(400).json({
            errors: {
                default: 'The id must be informed'
            }
        });
    }

    const result = await PatientsProvider.updateById(body, patient_id);

    if (result instanceof Error) {
        return res.status(500).json({
            errors: {
                default: result.message
            }
        });
    }

    res.status(204).json(result);

};
