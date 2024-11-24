import { PasswordCrypto } from "../../../shared/services/PasswordCrypto";
import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";
import { IUser } from "../../models/User";
import { v4 as uuidv4 } from 'uuid';



export const create = async (user: Omit<IUser, 'id'>): Promise<string | Error> => {
    const hashPassword = await PasswordCrypto.hashPassword(user.password);
    const timestamp = new Date().toISOString();

    const newUser: IUser = {
        ...user,
        id: uuidv4(),
        password: hashPassword,
        permission: 5, // by default,
        birthdate: new Date(user.birthdate).toISOString(),
        created_at: timestamp,
        updated_at: timestamp
    }

    const params = {
        TableName: EnumTableNames.users,
        Item: newUser,
    };


    try {
        await dynamoClient.put(params).promise();
        console.log('User created successfully:', newUser);
        return newUser.id;
    } catch (error) {
        console.error('Error creating user:', error);
        return new Error('Could not create user.');
    }
}