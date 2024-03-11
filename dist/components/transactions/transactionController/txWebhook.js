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
const node_crypto_1 = __importDefault(require("node:crypto"));
const response_1 = require("../../../utils/response");
const configs_1 = __importDefault(require("../../../configs"));
const { paystackSecret } = configs_1.default;
function txWebhookHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hash = node_crypto_1.default
                .createHmac("sha512", paystackSecret)
                .update(JSON.stringify(req.body))
                .digest("hex");
            if (hash == req.headers["x-paystack-signature"]) {
                const { event } = req.body;
                console.log(`Paystack event  ${req.body}`);
                res.sendStatus(200).send(200);
            }
        }
        catch (err) {
            (0, response_1.responseHandler)({
                res,
                err,
                message: `Internal Server Error:  ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = txWebhookHandler;
//# sourceMappingURL=txWebhook.js.map