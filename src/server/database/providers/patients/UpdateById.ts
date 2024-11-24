import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";
import { IPatient } from "../../models/Patient";

export const updateById = async (
    updateData: Partial<Omit<IPatient, 'id' | 'created_at'>>,
    id: string
): Promise<IPatient | Error> => {
    try {
        // Step 1: Fetch existing patient to validate
        const queryParams = {
            TableName: EnumTableNames.patients,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id,
            },
        };

        const existingPatient = await dynamoClient.query(queryParams).promise();
        if (!existingPatient.Items || existingPatient.Items.length === 0) {
            return new Error('Patient not found');
        }

        const timestamp = new Date().toISOString();

        // Step 2: Transform updateData (e.g., birthdate)
        const transformedUpdateData = { ...updateData };
        if (updateData.birthdate) {
            transformedUpdateData.birthdate = new Date(String(updateData.birthdate)).toISOString();
        }

        // Step 3: Build the update expression
        let updateExpression = 'SET updated_at = :updated_at';
        const expressionAttributeValues: { [key: string]: any } = {
            ':updated_at': timestamp,
        };
        const expressionAttributeNames: { [key: string]: string } = {};

        Object.entries(transformedUpdateData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'created_at') {
                updateExpression += `, #${key} = :${key}`;
                expressionAttributeValues[`:${key}`] = value;
                expressionAttributeNames[`#${key}`] = key;
            }
        });

        // Step 4: Perform the update operation
        const updateParams = {
            TableName: EnumTableNames.patients,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: 'ALL_NEW',
        };

        const result = await dynamoClient.update(updateParams).promise();
        console.log('Patient updated successfully:', result.Attributes);
        return result.Attributes as IPatient;
    } catch (error) {
        console.error('Error updating patient:', error);
        return new Error('Could not update patient.');
    }
};


// {
// 	"birthdate":"2003-07-01",
// }

// {
//     "created_at": "2024-11-24T00:02:37.145Z",
//     "updated_at": "2024-11-24T00:02:37.145Z",
//     "birthdate": "2024-11-13T03:00:00.000Z",
//     "id": "a5211d3d-e472-42c5-9545-d195dd490e91"
// }