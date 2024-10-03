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

export const receiveMessageFromSQS = async (): Promise<void> => {
    const queueUrl = "https://sqs.ap-south-1.amazonaws.com/992382610963/skylaunchersqs"

    if (!queueUrl) {
        console.error('Queue URL is not defined in environment variables');
        return;
    }

    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
    };

    try {
        const result = await sqs.receiveMessage(params).promise();
        if (result.Messages) {
            result.Messages.forEach(message => {
                console.log(`Received message: ${message.Body}`);
                // Process the message here

                // Optionally, delete the message after processing
                if (message.ReceiptHandle) {
                    deleteMessageFromSQS(message.ReceiptHandle);
                } else {
                    console.error('Message does not have a ReceiptHandle');
                }
            });
        } else {
            console.log('No messages received');
        }
    } catch (error) {
        console.error('Error receiving message from SQS:', error);
    }
};

const deleteMessageFromSQS = async (receiptHandle: string): Promise<void> => {
    const queueUrl = "https://sqs.ap-south-1.amazonaws.com/992382610963/skylaunchersqs"

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