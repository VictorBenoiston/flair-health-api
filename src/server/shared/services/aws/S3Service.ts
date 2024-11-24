import { S3Client, PutObjectCommand, GetObjectCommand, ObjectCannedACL, ListObjectsCommand } from "@aws-sdk/client-s3";
import * as AWS from '@aws-sdk/client-s3'
import { Readable } from "stream";
import "@aws-sdk/signature-v4-crt";


export const s3Client = new AWS.S3({
    region: String(process.env.AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
})


export const uploadToS3 = async (file: File, bucketName: string, folder: string = 'patients-profile-picture') => {
    const fileBuffer = await file.arrayBuffer();

    const fileName = `${folder}${folder ? '/' : ''}${Date.now()}_${file.name}`;
    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
        ACL: 'public-read' as ObjectCannedACL
    };

    console.log('Upload parameters:', uploadParams);

    console.log({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });


    const testBucketAccess = async () => {
        try {
            const result = await s3Client.listBuckets();
            // const result = await s3Client.send(new ListObjectsCommand({ Bucket: 'victor-bucket1' }));
            console.log('Bucket Access Test Success:', result);
        } catch (error) {
            console.error('Bucket Access Test Failed:', error);
        }
    };

    await testBucketAccess();

    try {
        console.log('Before S3 upload');
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('After S3 upload');

        const fileUrl = `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${fileName}`;
        console.log('File URL:', fileUrl);

        return fileUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};


export const getImageFromS3 = async (key: string): Promise<String | Error> => {
    const bucketArn = process.env.AWS_MULTI_REGION_ACCESS_POINT_ARN;
    if (!bucketArn) {
        throw new Error('AWS_MULTI_REGION_ACCESS_POINT_ARN is not defined in environment variables');
    }

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    };

    // const listParams = {
    //     Bucket: process.env.AWS_S3_BUCKET_NAME,
    // };

    // const listCommand = new AWS.ListObjectsV2Command(listParams);
    // const listResponse = await s3Client.send(listCommand);

    // console.log('Files in the bucket:', listResponse.Contents?.map(item => item.Key));

    console.log(key)

    try {
        const command = new GetObjectCommand(params);
        const response = await s3Client.send(command);


        if (!response.Body) {
            throw new Error('Empty response body');
        }

        console.log(s3Client.config.region)

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return fileUrl;
        
    } catch (error: any) {
        if (error.$metadata && error.$metadata.httpStatusCode === 404) {
            return new Error('Image not found');
        }
        console.error('Error fetching image from S3:', error);
        return new Error('Internal Server Error');
    }
};
