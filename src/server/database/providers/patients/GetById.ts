import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";
import { IPatient } from "../../models/Patient";

export const getById = async (id: string): Promise<IPatient | Error> => {
    const queryParams = {
        TableName: EnumTableNames.patients,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': id
        }
    };

    try {
        const result = await dynamoClient.query(queryParams).promise();
        
        if (!result.Items) {
            console.error('Patient not found:', id);
            return new Error('Patient not found');
        }

        console.log('Patient retrieved successfully:', result.Items);
        return result.Items[0] as IPatient;
    } catch (error) {
        console.error('Error retrieving patient:', error);
        return new Error('Could not retrieve patient');
    }
};
