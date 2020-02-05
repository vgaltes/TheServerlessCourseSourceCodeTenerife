const Log = require('@dazn/lambda-powertools-logger');

module.exports.handler = async () => {
  Log.info("Hey, I'm a log!");
  
  const res = {
      statusCode: 200,
      body: JSON.stringify('All done')
    };
  
    return res;
};
