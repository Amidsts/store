"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const OtpModel = (0, mongoose_1.model)("Otp", otpSchema);
exports.default = OtpModel;
//# sourceMappingURL=otp.model.js.map