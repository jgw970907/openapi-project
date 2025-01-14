type Context = {
  [key: string]: any;
};
exports.handler = async function (event: Event, context: Context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ apiKey: process.env.EDU_APIKEY }),
  };
};
