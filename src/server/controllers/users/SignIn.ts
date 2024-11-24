import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';
import { UsersProvider } from '../../database/providers/users';
import { IUser } from '../../database/models/User';
import { PasswordCrypto } from '../../shared/services/PasswordCrypto';
import { JWTService } from '../../shared/services/JWTService';


interface IBodyProps extends Omit<IUser, 'id' | 'full_name' | 'birthdate' | 'ssn' | 'permission' | 'created_at' | 'updated_at'> { }

export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().email().required().min(5),
        password: yup.string().required()
    }))
}))

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const { email, password } = req.body;

    const result = await UsersProvider.getByEmail(email);
    if (result instanceof Error) {
        res.status(401).json({
            errors: {
                default: 'Invalid email or password'
            }
        });
        return
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(password, result?.password ? result?.password : '')

    if (!passwordMatch) {
        res.status(401).json({
            errors: {
                default: 'Invalid email or password'
            }
        });
        return
    } else {
        const accessToken = JWTService.sign({ uid: result?.id ? result.id : '', permission: result?.permission ? result?.permission : 5 })
        if (accessToken === 'JWT_SECRET_NOT_FOUND') {
            res.status(500).json({
                errors: {
                    default: 'Error while generating access token'
                }
            });
            return
        }

        const responsePayload = {
            'accessToken': accessToken,
            'uid': result?.id,
            'user': result?.full_name,
        }

        return res.status(200).json(responsePayload);
    }
}
