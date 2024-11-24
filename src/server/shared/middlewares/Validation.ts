import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ValidationError, Schema, ObjectSchema, AnyObject, Maybe } from 'yup';

type TProperty = 'body' | 'header' | 'params' | 'query';
type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;
type TAllSchemas = Record<TProperty, Schema>;
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

type ValidationErrors = Record<string, string>;

export const validation: TValidation = (getAllSchemas) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const schemas = getAllSchemas((schema) => schema);
        const errorsResult: Record<string, ValidationErrors> = {};

        Object.entries(schemas).forEach(([key, schema]) => {
            try {
                schema.validateSync(req[key as TProperty], { abortEarly: false });
            } catch (error) {
                const yupError = error as ValidationError;
                const errors: ValidationErrors = {};

                yupError.inner.forEach(error => {
                    if (!error.path) return;
                    errors[error.path] = error.message;
                });

                errorsResult[key] = errors;
            }
        });

        if (Object.entries(errorsResult).length === 0) {
            return next();
        }
        
        res.status(400).json({ errors: errorsResult });
        return;
    };
};
