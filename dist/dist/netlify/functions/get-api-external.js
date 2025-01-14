"use strict";
exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ apiKey: process.env.EXTERNAL_APIKEY }),
    };
};
//# sourceMappingURL=get-api-external.js.map