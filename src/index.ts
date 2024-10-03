
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
app.use(cors());

app.post("/deploy", (req: any, res: any) => {
    const repoUrl = req.bosy.repoUrl;
    console.log(repoUrl);
    res.json({})
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 