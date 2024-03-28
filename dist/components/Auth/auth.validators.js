"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.resendOtpSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.signUpSchema = exports.signInSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signInSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
exports.signUpSchema = zod_1.default.object({
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
    phoneNo: zod_1.default.string(),
});
exports.forgotPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.resetPasswordSchema = zod_1.default
    .object({
    password: zod_1.default.string(),
    confirmPassword: zod_1.default.string(),
    email: zod_1.default.string().email(),
    code: zod_1.default.string().refine((value) => value.length === 6),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
});
exports.resendOtpSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    otpPurpose: zod_1.default.enum(["reset_password"]),
});
exports.verifyOtpSchema = zod_1.default.object({
    code: zod_1.default.string().refine((value) => value.length === 6),
    email: zod_1.default.string().email(),
    otpPurpose: zod_1.default.string()
});
//# sourceMappingURL=auth.validators.js.map