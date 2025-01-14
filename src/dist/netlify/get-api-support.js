"use strict";
exports.handler = async function () {
    return {
        statusCode: 200,
        body: JSON.stringify({ apiKey: process.env.SUPPORT_APIKEY }),
    };
};
//# sourceMappingURL=get-api-support.js.map