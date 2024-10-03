import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    try {
        const allFilesAndFolders = fs.readdirSync(folderPath);
        
        allFilesAndFolders.forEach(file => {
            const fullFilePath = path.join(folderPath, file);
            try {
                const stats = fs.statSync(fullFilePath);
                if (stats.isDirectory()) {
                    response = response.concat(getAllFiles(fullFilePath)); 
                } else {
                   
                    response.push(fullFilePath.split(path.sep).join(path.posix.sep));
                }
            } catch (err) {
                console.error(`Error reading file stats for ${fullFilePath}:`, err);
            }
        });
    } catch (err) {
        console.error(`Error reading directory ${folderPath}:`, err);
    }

    return response;
};

