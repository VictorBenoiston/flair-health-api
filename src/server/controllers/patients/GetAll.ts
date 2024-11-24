import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';
import { UsersProvider } from '../../database/providers/users';
import { IPatient } from '../../database/models/Patient';
import { PatientsProvider } from '../../database/providers/patients';


interface IQueryProps {
    page?: number;
    limit?: number;
    filter?: string;
}


export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional()
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    let result = await PatientsProvider.getAll();
    const count = await PatientsProvider.count();

    if (result instanceof Error) {
        return res.status(500).json({
            errors: {
                default: result.message
            }
        });
    } else if (count instanceof Error) {
        return res.status(500).json({
            errors: { default: count.message }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    res.status(200).json(result);
};
