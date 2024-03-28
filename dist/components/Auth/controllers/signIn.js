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
const response_1 = require("../../../utils/response");
const auth_model_1 = __importDefault(require("../auth.model"));
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const existingUser = yield auth_model_1.default.findOne({ email });
            if (!existingUser) {
                return (0, response_1.responseHandler)({
                    res,
                    status: 401,
                    message: "Invalid login credentials",
                });
            }
            if (!existingUser.comparePassword(password)) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "Invalid login credentials",
                    status: 401,
                });
            }
            const token = existingUser.generateToken({
                data: {
                    ref: existingUser._id,
                    role: existingUser.role,
                },
            });
            delete existingUser.password;
            return (0, response_1.responseHandler)({
                res,
                message: "Login successful, Welcome 🤗",
                data: {
                    token,
                    user: existingUser,
                },
            });
        }
        catch (err) {
            (0, response_1.responseHandler)({
                res,
                err,
                message: `Internal Server Error:  ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = signIn;
//# sourceMappingURL=signIn.js.map