import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export async function downloadS3Folder(prefix: string) {
    try {
        const allFiles = await s3.listObjectsV2({
            Bucket: "skylauncher",
            Prefix: prefix
        }).promise();

        const allPromises = allFiles.Contents?.map(async ({ Key }) => {
            return new Promise(async (resolve, reject) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path.join(__dirname, Key);
                const outputFile = fs.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "skylauncher",
                    Key
                }).createReadStream().pipe(outputFile).on("finish", () => {
                    resolve("");
                }).on("error", (err) => {
                    reject(err);
                });
            });
        }) || [];
        console.log("awaiting");

        await Promise.all(allPromises?.filter(x => x !== undefined));
    } catch (error) {
        console.error("Error downloading S3 folder:", error);
    }
}