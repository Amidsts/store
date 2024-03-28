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
function resendOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, otpPurpose } = req.body;
        try {
            const user = yield auth_model_1.default.findOne({ email });
            if (!user) {
                return (0, response_1.responseHandler)({
                    res,
                    status: 401,
                    message: "invalid credentials",
                });
            }
            const verificationCode = user.randomOTP();
            yield new otp_model_1.default({
                User: user._id,
                code: verificationCode,
                expireAt: new Date(Date.now() + 1000 * 60 * 30),
                purpose: otpPurpose,
            }).save();
            yield (0, mailTemplates_1.default)("forgotPasswordEmail", user.email, user.fullName, verificationCode);
            return (0, response_1.responseHandler)({
                res,
                message: "verification code has been sent to your mail",
            });
        }
        catch (err) {
            return (0, response_1.responseHandler)({
                res,
                message: `Internal Server Error:  ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = resendOtp;
//# sourceMappingURL=resendOtp.js.map