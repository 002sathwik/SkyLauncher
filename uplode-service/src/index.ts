
import express from 'express';
import cors from 'cors';
import path from 'path';
import simpleGit from 'simple-git';
import { generate } from './utils';
import { getAllFiles } from './files';
import { UploadFileToS3 } from './uplodeToS3';
import { receiveMessageFromSQS, sendMessageToSQS, } from './awsSQSuplode';
// import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

// const redisUrl = process.env.REDIS_URL_INSTANCE;

// if (!redisUrl) {
//   console.error('REDIS_URL_INSTANCE environment variable is not set');
//   process.exit(1);
// }

// const publisher = createClient({ url: redisUrl });
// publisher.connect().then(() => {
//   console.log('Publisher connected to Redis');
// }).catch(err => console.error('Failed to connect publisher to Redis', err));

// const subscriber = createClient({ url: redisUrl });
// subscriber.connect().then(() => {
//   console.log('Subscriber connected to Redis');
// }).catch(err => console.error('Failed to connect subscriber to Redis', err));

const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", async (req: any, res: any) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    console.log(id);
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`).split(path.sep).join(path.posix.sep));
    console.log("files");
  

    const uploadPromises = files.map(async (file) => {
        await UploadFileToS3(file.slice(__dirname.length + 1), file);
    });

    await Promise.all(uploadPromises);

    await sendMessageToSQS(id);
    console.log(`msg sent :${id}`);



    console.log("done");
    res.json({
        id: id
    })
});



app.get("/status", async (req: any, res:any) => {
  const id = req.query.id as string;

  if (!id) {
      return res.status(400).json({
          error: "Missing ID"
      });
  }

  const status = await receiveMessageFromSQS();

    console.log(status)

  if (status) {
      res.send(status)
  } else {
      res.status(404).json({
          error: "Status not found for the given ID"
      });
  }
});

app.post("/security", async (req, res) => {
    const key = req.body.key;
    const pass = process.env.SECURITY_KEY;
    console.log(key)
    console.log(pass)
    if (key === pass) {
      res.json({
        status: "success",
      });
    } else {
      res.json({
        status: "fails",
      });
    }
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 