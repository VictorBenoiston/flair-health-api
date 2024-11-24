import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";
import { IPatient } from "../../models/Patient";

export const getAll = async (): Promise<IPatient[] | Error> => {
    const params = {
        TableName: EnumTableNames.patients,
    };

    try {
        const result = await dynamoClient.scan(params).promise();
        const patients = result.Items as IPatient[];
        
        console.log('Successfully retrieved patients. Count:', patients.length);
        return patients;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return new Error('Could not fetch patients.');
    }
};