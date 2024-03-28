"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseHandler = ({ res, data, status = 200, err, message, }) => res.status(status).json({
    message,
    data,
    err
});
exports.responseHandler = responseHandler;
//# sourceMappingURL=response.js.map