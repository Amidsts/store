"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTestData = exports.verifyOtpData = exports.wrongResetPasswordData = exports.resetPasswordData = exports.wrongTestUserData = exports.testOtpData = exports.testUserData = void 0;
const auth_model_1 = __importDefault(require("../../../components/Auth/auth.model"));
const otp_model_1 = __importDefault(require("../../../components/Auth/otp.model"));
exports.testUserData = {
    firstName: "John",
    lastName: "Doe",
    email: "oreeyomi@gmail.com",
    password: "123_abc",
    phoneNo: "09044456788",
};
exports.testOtpData = {};
exports.wrongTestUserData = {
    email: "joha@email.com",
    password: "13$abcn",
};
const resetPasswordData = (code) => ({
    email: exports.testUserData.email,
    password: "efghy78",
    confirmPassword: "efghy78",
    code,
});
exports.resetPasswordData = resetPasswordData;
exports.wrongResetPasswordData = {
    email: exports.wrongTestUserData.email,
    password: "efghy78",
    confirmPassword: "efghy78",
    code: "abc234",
};
const verifyOtpData = (code, otpPurpose) => ({
    email: exports.testUserData.email,
    code,
    otpPurpose,
});
exports.verifyOtpData = verifyOtpData;
function saveTestData() {
    return {
        userAuth: new auth_model_1.default(Object.assign(Object.assign({}, exports.testUserData), { fullName: `${exports.testUserData.firstName} ${exports.testUserData.lastName}` })),
        resetPasswordOtp: (userId) => new otp_model_1.default({
            User: userId,
            code: "123abc",
            expireAt: new Date(Date.now() + 1000 * 60 * 30),
            purpose: "reset_password",
            isVerified: true,
        }),
    };
}
exports.saveTestData = saveTestData;
//# sourceMappingURL=authTestData.js.map