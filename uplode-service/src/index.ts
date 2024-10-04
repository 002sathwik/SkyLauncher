
import express from 'express';
import cors from 'cors';
import path from 'path';
import simpleGit from 'simple-git';
import { generate } from './utils';
import { getAllFiles } from './files';
import { UploadFileToS3 } from './uplodeToS3';
import { sendMessageToSQS } from './awsSQSuplode';
import { createClient } from "redis";


const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();


const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", async (req: any, res: any) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`).split(path.sep).join(path.posix.sep));
    console.log(files);
    files.forEach(async (file) => {
        await UploadFileToS3(file.slice(__dirname.length + 1), file);

    });
    await sendMessageToSQS(id);

    publisher.hSet("status", id, "uploded");
 
    console.log("done");
    res.json({
        id: id
    })
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 