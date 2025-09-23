const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ 
    region: process.env.AWS_REGION 
});

const checkJwt = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        // Validate the Cognito access token
        const result = await cognitoClient.send(new GetUserCommand({
            AccessToken: token
        }));

        // Add user info to request object
        req.user = result;
        next();
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = checkJwt;