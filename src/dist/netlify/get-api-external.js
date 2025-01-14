"use strict";
exports.handler = async function () {
    return {
        statusCode: 200,
        body: JSON.stringify({ apiKey: process.env.EXTERNAL_APIKEY }),
    };
};
//# sourceMappingURL=get-api-external.js.map