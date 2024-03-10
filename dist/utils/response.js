"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortSessionWithResponse = exports.commitSessionWithResponse = exports.responseHandler = void 0;
const responseHandler = ({ res, data, status = 200, err, message, }) => res.status(status).json({
    message,
    data,
    err
});
exports.responseHandler = responseHandler;
const commitSessionWithResponse = (_a) => __awaiter(void 0, [_a], void 0, function* ({ res, data, status = 200, message, session, err, }) {
    yield session.commitTransaction();
    session.endSession();
    return (0, exports.responseHandler)({ res, data, status, message, err, session });
});
exports.commitSessionWithResponse = commitSessionWithResponse;
const abortSessionWithResponse = (_b) => __awaiter(void 0, [_b], void 0, function* ({ res, data, status = 200, err, message, session, }) {
    yield session.abortTransaction();
    session.endSession();
    return (0, exports.responseHandler)({ res, data, status, message, err, session });
});
exports.abortSessionWithResponse = abortSessionWithResponse;
//# sourceMappingURL=response.js.map