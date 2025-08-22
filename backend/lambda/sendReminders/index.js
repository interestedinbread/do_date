const { GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const twilio = require('twilio');
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });


// does my file have access to .env from here?
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

exports.handler = async (event) => {
    try {
        
        const { userId, reminderId } = event;

        if (!userId || !reminderId) {
            throw new Error('Missing userId or reminderId in event');
        }

        const response = await docClient.send(new GetCommand({
            TableName: 'Reminders-3',
            Key: {
                userId: userId,
                reminderId: reminderId
            }
        }))

        const reminder = response.Item

        if(!reminder) {
            console.log('Reminder not found', reminderId)
            return { statusCode: 404, body: 'Reminder not found' }
        }

        if (reminder.sent) {
            console.log(`Reminder already sent: ${reminderId}`);
            return { statusCode: 200, body: 'Reminder already sent' }
        }

        // Get user's phone number (you'll need to implement this)
        const phoneNumber = await getUserPhoneNumber(userId);

        if(!phoneNumber) {
            console.log(`No phone number found for user: ${userId}`);
            return { statusCode: 400, body: 'No phone number found' };
        }

        await twilioClient.messages.create({
            body: `Reminder: ${reminder.description}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        })

        await docClient.send(new UpdateCommand({
            TableName: 'Reminders-3',
            Key: {
                userId: userId,
                reminderId: reminderId
            },
            UpdateExpression: 'SET sent = :sent, sentAt = :sentAt',
            ExpressionAttributeValues: {
                ':sent': true,
                ':sentAt': new Date().toISOString()
            }
        }));

        console.log(`SMS sent successfully for reminder: ${reminderId}`)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Reminder sent successfully',
                reminderId: reminderId
            })
        };
    } catch (err) {
        console.error('Lambda execution error:', err);
        throw err
    }
}

const getUserPhoneNumber = async () => {
    
    const user = await cognitoClient.send(new GetUserCommand({
        
    }))
    try {

    } catch (err) {

    }
}