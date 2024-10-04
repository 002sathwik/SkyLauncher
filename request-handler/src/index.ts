import express from "express";
import AWS from "aws-sdk";


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const app = express();

app.get("/*", async (req, res) => {
    try {
        const host = req.hostname;
        const id = host.split(".")[0];
        console.log(`Host: ${host}`);
        console.log(`ID: ${id}`);
        const filePath = req.path;
        console.log(`File Path: ${filePath}`);

        const key = `dist/${id}${filePath}`;
        console.log(`S3 Key: ${key}`);

        const params = {
            Bucket: "skylauncher",
            Key: key,
        };

        const data = await s3.getObject(params).promise();

        const type = filePath.endsWith("html")
            ? "text/html"
            : filePath.endsWith("css")
            ? "text/css"
            : "application/javascript";
        res.set("Content-Type", type);

        res.send(data.Body);
    } catch (error) {
        console.error("Error fetching object from S3:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});