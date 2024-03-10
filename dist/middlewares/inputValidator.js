"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../utils/response");
const validateInput = (schema, fieldType = "body") => (req, res, next) => {
    try {
        let parsedData;
        if (fieldType === "body") {
            parsedData = schema.parse(req.body);
            req.body = parsedData;
        }
        else if (fieldType === "params") {
            parsedData = schema.parse(req.params);
            req.params = parsedData;
        }
        else if (fieldType === "query") {
            parsedData = schema.parse(req.query);
            req.query = parsedData;
        }
        return next();
    }
    catch (err) {
        return (0, response_1.responseHandler)({
            res,
            message: `${err.issues[0].path[0]} ${err.issues[0].message.toLowerCase()}`,
            status: 400,
        });
    }
};
exports.default = validateInput;
//# sourceMappingURL=inputValidator.js.map