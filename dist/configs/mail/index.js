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
const axios_1 = __importDefault(require("axios"));
const __1 = __importDefault(require(".."));
const qs_1 = __importDefault(require("qs"));
const { mailgunApiKey, mailgunDomain, appEmail } = __1.default;
function emailConfig(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, html, from = appEmail, }) {
        try {
            const { data } = yield axios_1.default.post(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, qs_1.default.stringify({
                from,
                to,
                subject,
                html,
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: "api",
                    password: mailgunApiKey,
                },
            });
            return data;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = emailConfig;
//# sourceMappingURL=index.js.map