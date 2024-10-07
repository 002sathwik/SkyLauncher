import { buildProject } from "./build";
import { downloadS3Folder, } from "./downlodeFromS3";
import { receiveMessageFromSQS, sendMessageToSQSStatus} from "./reciveMsgFromSQS";
import { uplodeBuildToS3 } from "./uplodeBuildToS3";
// import { createClient } from 'redis'

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
// publisher.connect();

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
            await  sendMessageToSQSStatus(id)
            console.log("deplpoyed")

        }
    }
}

main();
