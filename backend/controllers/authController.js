// controllers/authController.js
const twilio = require('twilio');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb') 
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.sendVerificationSMS = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await docClient.send(new PutCommand({
        TableName: 'verification-codes',
        Item: {
            phoneNumber,
            code: verificationCode,
            ttl: Math.floor(Date.now() / 1000) + 300
        }
    }))
    
    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    res.json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, message: 'Failed to send SMS' });
  }
};

exports.verifyPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber, verificationCode, accessToken } = req.body;

    const user = await cognitoClient.send(new GetUserCommand({
      AccessToken: accessToken
    }))

    const userId = user.UserAttributes.find(
      attr => attr.Name === "sub"
    )?.Value

    const result = await docClient.send(new GetCommand({
        TableName: 'verification-codes',
        Key: { phoneNumber }
    }))
    
    if (!result.Item) {
      return res.status(400).json({ success: false, message: 'No verification code found' });
    }
    
    if (result.Item.code !== verificationCode) {
        return res.status(400).json({ success: false, message: 'Invalid verification code' })
    }

    await docClient.send(new DeleteCommand({
        TableName: 'verification-codes',
        Key: { phoneNumber }
    }))
    
    // Store verification status in DynamoDB since phone_number_verified is read-only in Cognito
    await docClient.send(new PutCommand({
        TableName: 'verification-codes',
        Item: {
            phoneNumber,
            verified: true,
            verifiedAt: new Date().toISOString(),
            ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
        }
    }))
    
    console.log('Phone number verification status stored in DynamoDB')

    await docClient.send(new PutCommand({
      TableName: 'verified-phone-numbers',
      Item: {
        userId,
        phoneNumber,
        verifiedAt: new Date().toISOString()
      }
    }))
    
    res.json({ success: true, message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Error verifying phone:', error);
    res.status(500).json({ success: false, message: 'Failed to verify phone number' });
  }
};

exports.checkPhoneVerification = async (req, res) => {
    try{
        const { accessToken } = req.body

        // Get user info from Cognito to get phone number
        const result = await cognitoClient.send(new GetUserCommand({
            AccessToken: accessToken
        }))

        const phoneNumber = result.UserAttributes.find(
            attr => attr.Name === 'phone_number'
        )?.Value

        if (!phoneNumber) {
            return res.json({
                success: true,
                phoneVerified: false,
                phoneNumber: null
            })
        }

        // Check verification status in DynamoDB
        const verificationResult = await docClient.send(new GetCommand({
            TableName: 'verification-codes',
            Key: { phoneNumber }
        }))

        const phoneVerified = verificationResult.Item?.verified === true

        res.json({
            success: true,
            phoneVerified,
            phoneNumber
        })
    } catch (error) {
        console.error('Error checking phone verification:', error)
        res.status(500).json({ success: false, message: 'Failed to check verification status' });
    }
}