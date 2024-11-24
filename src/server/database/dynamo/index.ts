import { DynamoDB } from 'aws-sdk';

// Load environment variables
const dynamoClient = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.DYNAMO_ENDPOINT || undefined
});

export default dynamoClient;