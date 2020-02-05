const Log = require('@dazn/lambda-powertools-logger');
const middy = require("middy");
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');


const handler = async (event, context) => {
  const joinedGetTogether = JSON.parse(event.Records[0].Sns.Message);

  Log.info('notified organiser', {
    getTogetherId: joinedGetTogether.getTogetherId, 
    orderId: joinedGetTogether.orderId, userEmail:joinedGetTogether.userEmail});

  return "all done";
};

module.exports.handler = middy(handler)
  .use(correlationIds({ sampleDebugLogRate: 0 }));