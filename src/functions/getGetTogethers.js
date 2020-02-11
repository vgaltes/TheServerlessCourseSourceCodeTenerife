const AWSXray = require("aws-xray-sdk");
const AWS = AWSXray.captureAWS(require("aws-sdk"));
const middy = require("middy");
const { ssm } = require("middy/middlewares");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const handler = async (evt, context) => {
  const count = 8;
  const tableName = context.tableName;

  const req = {
    TableName: tableName,
    Limit: count
  };

  const resp = await dynamodb.scan(req).promise();

  const res = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(resp.Items)
  };

  return res;
};

module.exports.handler = middy(handler).use(
  ssm({
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 1000,
    setToContext: true,
    names: {
      tableName: `${process.env.getTogethersTableNamePath}`
    }
  })
);