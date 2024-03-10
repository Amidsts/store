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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const response_1 = require("../utils/response");
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization;
    token = token === null || token === void 0 ? void 0 : token.replace("Bearer ", "");
    if (!token)
        return next();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, configs_1.default.authConfigs.jwtSecret);
        req.decoded = decoded;
        return next();
    }
    catch (err) {
        if (err.name) {
            if (err.name === "JsonWebTokenError") {
                return (0, response_1.responseHandler)({
                    res,
                    message: "invalid token",
                    status: 401,
                    err,
                });
            }
            else if (err.name === "TokenExpiredError") {
                return (0, response_1.responseHandler)({
                    res,
                    message: "authentication expired. Please login again",
                    status: 401,
                    err,
                });
            }
        }
    }
});
exports.default = validateToken;
//# sourceMappingURL=tokenValidator.js.map