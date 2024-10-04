import { buildProject } from "./build";
import { downloadS3Folder, } from "./downlodeFromS3";
import { receiveMessageFromSQS } from "./reciveMsgFromSQS";
import { uplodeBuildToS3 } from "./uplodeBuildToS3";
import { createClient } from 'redis'

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while (true) {
        const messages = await receiveMessageFromSQS();
        for (const message of messages) {
            console.log(`id: ${message.MessageId}, message: ${message.Body}`);
            const id = message.Body;
            console.log(`output/${id}`)
            await downloadS3Folder(`output/${id}`);
            console.log(`Downloaded ${message.Body}`);
            await buildProject(id);
            await uplodeBuildToS3(id);
            publisher.hSet("status", id , "deployed");
        }
    }
}

main();
