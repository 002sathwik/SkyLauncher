import { SQS } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new SQS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1"
});

export const sendMessageToSQS = async (messageBody: string): Promise<void> => {
    const queueUrl = "https://sqs.ap-south-1.amazonaws.com/992382610963/skylaunchersqs"


    if (!queueUrl) {
        console.error('Queue URL is not defined in environment variables');
        return;
    }

    const params = {
        MessageBody: messageBody,
        QueueUrl: queueUrl
    };

    try {
        const result = await sqs.sendMessage(params).promise();
        console.log(`Message sent to SQS with ID: ${result.MessageId}`);
    } catch (error) {
        console.error('Error sending message to SQS:', error);
    }
};


export const receiveMessageFromSQS = async (): Promise<any[]> => {
    const queueUrl = "https://sqs.ap-south-1.amazonaws.com/992382610963/statusSQS";

    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10
    };

    try {
        const result = await sqs.receiveMessage(params).promise();
        if (result.Messages) {

            for (const message of result.Messages) {

                if (message.ReceiptHandle) {
                    await deleteMessageFromSQS(message.ReceiptHandle);
                } else {
                    console.error('Message does not have a ReceiptHandle');
                }
            }
            return result.Messages;
        } else {
            console.log('No messages received');
            return [];
        }
    } catch (error) {
        console.error('Error receiving message from SQS:', error);
        return [];
    }

};

const deleteMessageFromSQS = async (receiptHandle: string): Promise<void> => {
    const queueUrl = "https://sqs.ap-south-1.amazonaws.com/992382610963/statusSQS";

    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };

    try {
        await sqs.deleteMessage(params).promise();
        console.log('Message deleted from SQS');
    } catch (error) {
        console.error('Error deleting message from SQS:', error);
    }
};
