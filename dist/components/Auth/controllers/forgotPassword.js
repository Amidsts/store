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
const otp_model_1 = __importDefault(require("../otp.model"));
const auth_model_1 = __importDefault(require("../auth.model"));
const mailTemplates_1 = __importDefault(require("../../../configs/mail/mailTemplates"));
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            const existingUser = yield auth_model_1.default.findOne({ email });
            if (!existingUser) {
                return (0, response_1.responseHandler)({
                    res,
                    status: 401,
                    message: "Invalid login credentials",
                });
            }
            const verificationCode = existingUser.randomOTP();
            yield new otp_model_1.default({
                User: existingUser._id,
                code: verificationCode,
                expireAt: new Date(Date.now() + 1000 * 60 * 30),
                purpose: "reset_password",
                isVerified: false,
            }).save();
            yield (0, mailTemplates_1.default)("forgotPasswordEmail", existingUser.email, existingUser.fullName, verificationCode);
            return (0, response_1.responseHandler)({
                res,
                message: "verification code has been sent to your mail",
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
exports.default = forgotPassword;
//# sourceMappingURL=forgotPassword.js.map