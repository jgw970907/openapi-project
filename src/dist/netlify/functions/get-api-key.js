"use strict";
exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ apiKey: process.env.JOB_APIKEY }),
    };
};
//# sourceMappingURL=get-api-key.js.map