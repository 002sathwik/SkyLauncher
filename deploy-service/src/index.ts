import { receiveMessageFromSQS } from "./reciveMsgFromSQS";

async function main() {
    while (true) {
        const messages = await receiveMessageFromSQS();
        messages.forEach(message => {
            console.log(`id: ${message.MessageId}, message: ${message.Body}`);
        });
    }
}

main();