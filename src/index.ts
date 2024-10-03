
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import simpleGit from 'simple-git';
import { generate } from './utils';

const app = express();
app.use(cors());
app.use(express.json());
app.post("/deploy", async (req: any, res: any) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, `output/${id}`);
    console.log(repoUrl);
    res.json({
        id:id
    })
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 