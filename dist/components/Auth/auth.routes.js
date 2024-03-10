"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = __importDefault(require("./controllers/signup"));
const signIn_1 = __importDefault(require("./controllers/signIn"));
const auth_validators_1 = require("./auth.validators");
const verifyOtp_1 = __importDefault(require("./controllers/verifyOtp"));
const resendOtp_1 = __importDefault(require("./controllers/resendOtp"));
const forgotPassword_1 = __importDefault(require("./controllers/forgotPassword"));
const resetPassword_1 = __importDefault(require("./controllers/resetPassword"));
const inputValidator_1 = __importDefault(require("../../middlewares/inputValidator"));
const router = (0, express_1.Router)();
router.post("/signup", (0, inputValidator_1.default)(auth_validators_1.signUpSchema), signup_1.default);
router.post("/verify-otp", (0, inputValidator_1.default)(auth_validators_1.verifyOtpSchema), verifyOtp_1.default);
router.post("/resend-otp", (0, inputValidator_1.default)(auth_validators_1.resendOtpSchema), resendOtp_1.default);
router.post("/signin", (0, inputValidator_1.default)(auth_validators_1.signInSchema), signIn_1.default);
router.post("/forgot-password", (0, inputValidator_1.default)(auth_validators_1.forgotPasswordSchema), forgotPassword_1.default);
router.patch("/reset-password", (0, inputValidator_1.default)(auth_validators_1.resetPasswordSchema), resetPassword_1.default);
const authRouter = router;
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map