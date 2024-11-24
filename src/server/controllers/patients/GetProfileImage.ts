import { Request, Response } from 'express';
import { PatientsProvider } from '../../database/providers/patients';
import { getImageFromS3 } from '../../shared/services/aws/S3Service';


export const getProfileImage = async (req: Request, res: Response) => {
    const { key } = req.body
    let result = await getImageFromS3(key);

    console.log(result)

    if (result instanceof Error) {
        return res.status(500).json({
            errors: {
                default: result.message
            }
        });
    }

    res.status(200).json({result});
};
