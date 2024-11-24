import dynamoClient from "../../dynamo";
import { EnumTableNames } from "../../EnumTableNames";
import { IUser } from "../../models/User";

export const getByEmail = async (email: string): Promise<IUser | null | Error> => {
    const params = {
        TableName: EnumTableNames.users,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    };

    try {
        const result = await dynamoClient.scan(params).promise();
        if (result.Items && result.Items.length > 0) {
            const user = result.Items[0] as IUser;
            console.log('User retrieved successfully:', user);
            return user;
        }
        console.log('User not found with email:', email);
        return null;
    } catch (error) {
        console.error('Error retrieving user by email:', error);
        return new Error('Could not retrieve user by email.');
    }
};
