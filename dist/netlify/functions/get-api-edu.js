"use strict";
exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ apiKey: process.env.EDU_APIKEY }),
    };
};
//# sourceMappingURL=get-api-edu.js.map