/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger
  console.log("PreSignUp event:", event);

    // Automatically confirm the user
    event.response.autoConfirmUser = true;

    // Optionally, auto-verify the email if your sign-in uses email
    if (event.request.userAttributes.hasOwnProperty("email")) {
        event.response.autoVerifyEmail = true;
    }

    // If you want to auto-verify phone numbers as well:
    if (event.request.userAttributes.hasOwnProperty("phone_number")) {
        event.response.autoVerifyPhone = true;
    }



  return event;
};
