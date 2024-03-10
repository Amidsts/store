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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = require("node:crypto");
const configs_1 = __importDefault(require("../../configs"));
const { authConfigs, hashPepper } = configs_1.default;
const authSchema = new mongoose_1.Schema({
    User: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
    },
    acctStatus: {
        type: String,
        enum: ["active", "suspended"],
        default: "active",
    },
}, { timestamps: true });
authSchema.methods.comparePassword = function (password) {
    return bcrypt_1.default.compareSync(password + hashPepper, this.password);
};
authSchema.methods.generateToken = ({ data, expiresIn = authConfigs.tokenLifeSpan, audience = "web", }) => jsonwebtoken_1.default.sign(data, authConfigs.jwtSecret, {
    expiresIn,
    issuer: `store-${configs_1.default.environment}`,
    audience: `${audience}-user`,
});
authSchema.methods.randomOTP = () => (0, node_crypto_1.randomBytes)(3).toString("hex");
authSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                const salt = yield bcrypt_1.default.genSalt(authConfigs.saltRounds);
                const hashedPassword = yield bcrypt_1.default.hash(this.password + hashPepper, salt);
                this.password = hashedPassword;
            }
            next();
        }
        catch (err) {
            return next(err);
        }
    });
});
const AuthModel = (0, mongoose_1.model)("Auth", authSchema);
exports.default = AuthModel;
//# sourceMappingURL=auth.model.js.map