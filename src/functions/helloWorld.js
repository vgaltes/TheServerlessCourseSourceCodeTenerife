module.exports.handler = async event => {
  console.log(JSON.stringify(event));

  const name = event.queryStringParameters.name;

  const res = {
    statusCode: 200,
    body: JSON.stringify(`Hello ${name}`)
  };

  return res;
}
