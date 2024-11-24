import { IUser } from "../../database/models/User";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { Request, Response } from "express";
import { UsersProvider } from "../../database/providers/users";

interface IBodyProps extends Omit<IUser, 'id'> { }

export const createValidation = validation((getSchema) => ({
    body: yup.object<IBodyProps>().shape({
        full_name: yup.string().required().max(255),
        email: yup.string().required().email(),
        password: yup.string().required(),
        birthdate: yup.date().required(),
        ssn: yup.string().required().max(255),
        permission: yup.number().optional()
    })
}));

export const create = async (req:Request<{}, {}, IUser>, res: Response) => {
    const result = await UsersProvider.create(req.body);

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