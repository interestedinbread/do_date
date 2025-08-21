const twilio = require('twilio');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb') 
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.addReminder = async (req, res) => {

    const { reminder_time, description, title, accessToken } = req.body
   
    const result = await cognitoClient.send(new GetUserCommand({
        AccessToken: accessToken
    }))

    const userId = result.UserAttributes.find(
        attr => attr.Name === "sub"
    )?.Value

    const reminderId = Date.now().toString() + Math.random().toString(36).substring(2, 9)

    const createdAt = new Date().toISOString()

    try{
        await docClient.send(new PutCommand({
            TableName: 'Reminders-3',
            Item: {
                userId,
                reminderId,
                createdAt,
                title,
                description,
                reminder_time,
                sent: false
            }
        }))

        res.json({ success: true, message: 'Reminder added successfully' })
    } catch (err) {
        console.error('Error adding reminder:', err)
        res.status(500).json({ success: false, message: 'Failed to add reminder' })
    }
}

exports.getReminders = async (req, res) => {
    const accessToken = req.headers['authorization']?.replace('Bearer ', '')

    const user = await cognitoClient.send(new GetUserCommand({
        AccessToken: accessToken
    }))

    const userId = user.UserAttributes.find(
        attr => attr.Name === 'sub'
    )?.Value

    try{
        const response = await docClient.send(new QueryCommand({
            TableName: 'Reminders-3',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }))

        res.json({ success: true, reminders: response.Items})
    } catch (err) {
        console.error('Error getting reminders:', err)
        res.status(500).json({ success: false, message: 'Failed to get reminders' })
    }
}

exports.deleteReminder = async (req, res) => {
    const { accessToken } = req.body
    const { reminderId } = req.params
    
    const result = await cognitoClient.send(new GetUserCommand({
        AccessToken: accessToken
    }))

    const userId = result.UserAttributes.find(
        attr => attr.Name === 'sub'
    )?.Value

    try{
        await docClient.send(new DeleteCommand({
            TableName: 'Reminders-3',
            Key: {
                userId,
                reminderId
            }
        }))

        res.json({ success: true, message: 'Reminder deleted successfully' })
    } catch (err) {
        console.error('Error deleting reminder', err)
        res.status(500).json({ success: false, message: 'Failed to delete reminder' })
    }
}