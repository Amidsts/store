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
const response_1 = require("../utils/response");
const auth_model_1 = __importDefault(require("../components/Auth/auth.model"));
const requireAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.decoded) {
        return (0, response_1.responseHandler)({
            res,
            message: "authentication is required",
            status: 401,
        });
    }
    const { ref, role } = req.decoded;
    try {
        const user = yield auth_model_1.default.findById(ref);
        if (!user) {
            return (0, response_1.responseHandler)({
                res,
                message: "authorization failed",
                status: 401,
            });
        }
        req.role = role;
        return next();
    }
    catch (err) {
        return (0, response_1.responseHandler)({
            res,
            message: "Authentication error",
            status: 401,
            err,
        });
    }
});
exports.default = requireAuthMiddleware;
//# sourceMappingURL=requireAuth.js.map