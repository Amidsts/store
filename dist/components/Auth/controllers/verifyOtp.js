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
function verifyOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, email, otpPurpose } = req.body;
        try {
            const userExist = yield auth_model_1.default.findOne({ email });
            if (!userExist) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "There was a problem at this time, pls wait some minutes",
                    status: 404,
                });
            }
            const otpExist = yield otp_model_1.default.findOne({
                User: userExist._id,
                code,
                purpose: otpPurpose,
            });
            if (!otpExist) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "invalid verification code",
                    status: 404,
                });
            }
            const now = new Date();
            if (now > otpExist.expireAt) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "OTP has expired",
                    status: 400,
                });
            }
            otpExist.isVerified = true;
            otpExist.expireAt = now;
            yield otpExist.save();
            return (0, response_1.responseHandler)({
                res,
                message: "otp verification completed, proceed to reset your password",
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
exports.default = verifyOtp;
//# sourceMappingURL=verifyOtp.js.map