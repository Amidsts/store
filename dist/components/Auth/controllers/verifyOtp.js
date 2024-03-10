"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const user_model_1 = __importStar(require("../../Users/user.model"));
const auth_model_1 = __importDefault(require("../auth.model"));
const mongoose_1 = require("mongoose");
function verifyOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, email, otpPurpose } = req.body;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const userExist = yield user_model_1.default.findOne({ email }).session(session);
            if (!userExist) {
                return (0, response_1.abortSessionWithResponse)({
                    res,
                    session,
                    message: "There was a problem at this time, pls wait some minutes",
                    status: 404,
                });
            }
            const userAuth = yield auth_model_1.default.findOne({ User: userExist._id }).session(session);
            if (!userAuth) {
                return (0, response_1.abortSessionWithResponse)({
                    res,
                    session,
                    message: "There was a problem at this time, pls wait some minutes",
                    status: 404,
                });
            }
            const otpExist = yield user_model_1.OtpModel.findOne({
                User: userExist._id,
                code,
                purpose: otpPurpose,
            }).session(session);
            if (!otpExist) {
                return (0, response_1.abortSessionWithResponse)({
                    res,
                    session,
                    message: "invalid verification code",
                    status: 404,
                });
            }
            const now = new Date();
            if (now > otpExist.expireAt) {
                return (0, response_1.abortSessionWithResponse)({
                    res,
                    session,
                    message: "OTP has expired",
                    status: 400,
                });
            }
            otpExist.isVerified = true;
            otpExist.expireAt = now;
            yield otpExist.save({ session });
            return (0, response_1.commitSessionWithResponse)({
                res,
                session,
                message: "otp verification completed, proceed to reset your password",
            });
        }
        catch (err) {
            (0, response_1.abortSessionWithResponse)({
                res,
                session,
                err,
                message: `Internal Server Error:  ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = verifyOtp;
//# sourceMappingURL=verifyOtp.js.map