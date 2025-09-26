const { DynamoDBClient } = require('@aws-sdk/client-dynamodb') 
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { EventBridgeClient, PutRuleCommand, PutTargetsCommand } = require('@aws-sdk/client-eventbridge')


const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION })


exports.addReminder = async (req, res) => {

    const { reminder_time, description, title, timezone } = req.body

    const userId = req.user.UserAttributes.find(
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

        try {
            await eventBridgeHandler(userId, reminderId, reminder_time, timezone)
        } catch (err) {
            await docClient.send(new DeleteCommand({
                TableName: 'Reminders-3',
                Key: { userId, reminderId }
            }))

            return res.status(500).json({
                success: false,
                message: 'Failed to schedule reminder notification'
            });
        }
        
        res.json({ success: true, message: 'Reminder added successfully' })
    } catch (err) {
        console.error('Error adding reminder:', err)
        res.status(500).json({ success: false, message: 'Failed to add reminder' })
    }
}

exports.getReminders = async (req, res) => {

    const userId = req.user.UserAttributes.find(
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

    const { reminderId } = req.params

    const userId = req.user.UserAttributes.find(
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

const eventBridgeHandler = async (userId, reminderId, reminder_time, timezone) => {
    
    try{

        const localDate = new Date(reminder_time);

        const utcDate = new Date(localDate.toLocaleString('en-US', { timeZone: 'UTC' }));
        const userDate = new Date(localDate.toLocaleString('en-US', { timeZone: timezone }));
        const offset = utcDate.getTime() - userDate.getTime();

        const correctUtcDate = new Date(localDate.getTime() + offset);
        
        const cronExpression = `cron(${correctUtcDate.getUTCMinutes()} ${correctUtcDate.getUTCHours()} ${correctUtcDate.getcorrectUtcDate()} ${correctUtcDate.getUTCMonth() + 1} ? ${correctUtcDate.getUTCFullYear()})`;
        console.log('cronExpression:', cronExpression)
        console.log('User timezone:', timezone)

        await eventBridge.send(new PutRuleCommand({
            Name: `reminder-${reminderId}`,
            ScheduleExpression: cronExpression,
            State: 'ENABLED'
        }));

        await eventBridge.send(new PutTargetsCommand({
            Rule: `reminder-${reminderId}`,
            Targets: [{
                Id: `reminder-target-${reminderId}`,
                Arn: 'arn:aws:lambda:us-east-2:554580246362:function:sendReminder',
                Input: JSON.stringify({
                    userId,
                    reminderId
                })
            }]
        }));
    } catch (err) {
        console.error('EventBridge setup failed:', err);
        throw err;
    }
}