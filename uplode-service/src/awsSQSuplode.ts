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


