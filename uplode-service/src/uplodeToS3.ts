import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';


dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const UploadFileToS3 = async (fileName: string, localFilePath: string) => {
    console.log("called");

    const fileContent = fs.readFileSync(localFilePath);

    const response = await s3.upload({
        Body: fileContent,
        Bucket: 'skylauncher',
        Key: fileName
    }).promise();

    
};