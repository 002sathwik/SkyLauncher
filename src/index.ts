
import express from 'express';
import cors from 'cors';
import path from 'path';
import simpleGit from 'simple-git';
import { generate } from './utils';
// import {getAllFiles} from './files';
const app = express();
app.use(cors());
app.use(express.json());
app.post("/deploy", async (req: any, res: any) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));


    // const files = getAllFiles(path.join(__dirname, `output/${id}`));
    // console.log(files);
    res.json({
        id: id
    })
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 