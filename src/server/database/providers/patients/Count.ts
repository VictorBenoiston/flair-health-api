import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";

export const count = async (): Promise<number | Error> => {
    const params = {
        TableName: EnumTableNames.patients,
        Select: 'COUNT'
    };

    try {
        const result = await dynamoClient.scan(params).promise();
        const count = result.Count || 0;
        
        return count;
    } catch (error) {
        console.error('Error counting patients:', error);
        return new Error('Could not count patients.');
    }
};