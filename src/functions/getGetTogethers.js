const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.getTogethersTableName;

module.exports.handler = async () => {
  const count = 8;

  const req = {
    TableName: tableName,
    Limit: count
  };

  const resp = await dynamodb.scan(req).promise();

  const res2 = {
    statusCode: 200,
    body: JSON.stringify(resp.Items)
  };

  return res2;
};
