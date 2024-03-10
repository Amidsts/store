"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    }
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
const otpSchema = new mongoose_1.Schema({
    User: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    code: {
        type: String,
        required: true,
    },
    expireAt: Date,
    purpose: {
        type: String,
        enum: ["reset_password"],
        required: true,
    },
    isVerified: Boolean,
}, { timestamps: true });
exports.OtpModel = (0, mongoose_1.model)("Otp", otpSchema);
//# sourceMappingURL=user.model.js.map