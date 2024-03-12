"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ms_1 = __importDefault(require("ms"));
const { env } = process;
const appConfig = {
    environment: env.NODE_ENV,
    port: env.PORT,
    mongoDbUri: env.NODE_ENV === "testing" ? env.MONGODB_URI_TEST : env.MONGODB_URI,
    hashPepper: env.HASH_PEPPER,
    authConfigs: {
        saltRounds: 10,
        jwtSecret: env.JWT_SECRET || "",
        tokenLifeSpan: (0, ms_1.default)("1days"),
    },
    paystackSecret: env.PAYSTACK_SECRET,
    paystackPublicKey: env.PAYSTACK_PUBLIC_KEY,
    mailgunApiKey: env.MAILGUN_API_KEY,
    mailgunDomain: env.MAILGUN_DOMAIN,
    appEmail: env.APP_EMAIL,
};
exports.default = appConfig;
//# sourceMappingURL=index.js.map