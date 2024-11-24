import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";
import { IPatient } from "../../models/Patient";
import { v4 as uuidv4 } from 'uuid';



export const create = async (patient: Omit<IPatient, 'id'>): Promise<string | Error> => {
    const timestamp = new Date().toISOString();

    const newPatient: IPatient = {
        ...patient,
        id: uuidv4(),
        birthdate: new Date(patient.birthdate).toISOString(),
        created_at: timestamp,
        updated_at: timestamp
    }


    const params = {
        TableName: EnumTableNames.patients,
        Item: newPatient,
    };


    try {
        await dynamoClient.put(params).promise();
        console.log('Patient created successfully:', newPatient);
        console.log('table:', params.TableName);
        return newPatient.id;
    } catch (error) {
        console.error('Error creating patient:', error);
        return new Error('Could not create patient.');
    }
}