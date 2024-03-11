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
const _1 = __importDefault(require("."));
const templates = {
    forgotPasswordEmail: (to, userName, code) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, _1.default)({
            to,
            subject: "Forgot Your Password ?",
            html: `
            <html>
                <head>
                </head>
                <body>
                    <h4>Hello ${userName},</h4> <p>We received a request to change the password to your Store account. To reset you password, please use the following One-Time Password (OTP): </p>
                    <h3 style=\"text-align: center\">${code}</h3>
                    <p style=\"text-align: center\"><strong>Note:</strong> This code expires in 30 minutes.</p>
                    <p>If you did not initiate this password reset mail, kindly ignore to keep your account safe</p>
                </body>
            </html>
        `,
        });
    }),
};
const sendEmail = (purpose, to, userName, code) => __awaiter(void 0, void 0, void 0, function* () {
    switch (purpose) {
        case "forgotPasswordEmail":
            yield templates.forgotPasswordEmail(to, userName, code);
            break;
        default:
            break;
    }
    return;
});
exports.default = sendEmail;
//# sourceMappingURL=mailTemplates.js.map