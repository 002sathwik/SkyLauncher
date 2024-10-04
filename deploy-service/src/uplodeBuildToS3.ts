import dotenv from "dotenv";
import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export function uplodeBuildToS3(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/build`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        const s3Key = `dist/${id}/` + file.slice(folderPath.length + 1).replace(/\\/g, '/');
        uploadFile(s3Key, file);
    });
}

const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "skylauncher",
        Key: fileName,
    }).promise();
    console.log(response);
}
