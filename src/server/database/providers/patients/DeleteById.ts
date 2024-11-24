import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";

export const deleteById = async (id: string): Promise<boolean | Error> => {
    try {
        // First, query to get the item with its email
        const queryParams = {
            TableName: EnumTableNames.patients,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id
            }
        };

        const queryResult = await dynamoClient.query(queryParams).promise();
        
        if (!queryResult.Items || queryResult.Items.length === 0) {
            console.log('No patient found with ID:', id);
            return false;
        }

        const deleteParams = {
            TableName: EnumTableNames.patients,
            Key: {
                id: id,
            },
            ReturnValues: 'ALL_OLD'
        };

        const deleteResult = await dynamoClient.delete(deleteParams).promise();
        console.log('Successfully deleted patient with ID:', id);
        return true;

    } catch (error) {
        console.error('Error deleting patient:', error);
        return new Error('Could not delete patient.');
    }
};