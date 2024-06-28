const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
 const {S3Client,PutObjectCommand}= require('@aws-sdk/client-s3')

 const s3Client = new S3Client({
    region:'',
    credentials:{
        accessKeyId:'',
        secretAccessKey:''
    }
 })
async function init() {
  console.log("Executing Script.js ");
  const outDirPath = path.join(__dirname, "output");
  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout.on("data", function (data) {
    console.log(data.toString());
  });
  p.stdout.on("error", function (data) {
    console.log("ERROR", data.toString());
  });
  p.on("close", async function () {
    console.log("Build Complete");
    const distFolderpath = path.join(__dirname, "output", "dist");
    const distFolderContents = fs.readdirSync(distFolderpath, {
      recursive: true,
    });
   //going to every dist folder by build file , and uploding it to aws s3
    for (const filePath of distFolderContents){
        if(fs.lstatSync(filePath).isDirectory()) continue;
    }
  });
}
