const AWSXray = require("aws-xray-sdk");
const chance = require("chance").Chance();
const SNSClient = require('@dazn/lambda-powertools-sns-client')
const SNS = AWSXray.captureAWSClient(SNSClient);
const Log = require('@dazn/lambda-powertools-logger');
const middy = require("middy");
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');

const handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const getTogetherId = body.getTogetherId;
  const userEmail = body.userEmail;

  const orderId = chance.guid();
  Log.info('user joining gettogether', {userEmail, getTogetherId});

  const data = {
    orderId,
    getTogetherId,
    userEmail
  };

  const params = {
    Message: JSON.stringify(data),
    TopicArn: process.env.joinGetTogetherSnsTopic
  };

  await SNS.publish(params).promise();

  Log.info("published 'join_getTogether' event", {getTogetherId, userEmail});

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId })
  };

  return response;
};

module.exports.handler = middy(handler)
  .use(correlationIds({ sampleDebugLogRate: 0 }));