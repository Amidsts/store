"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const txWebhook_1 = __importDefault(require("./transactionController/txWebhook"));
const inputValidator_1 = __importDefault(require("../../middlewares/inputValidator"));
const transaction_validators_1 = require("./transaction.validators");
const tokenValidator_1 = __importDefault(require("../../middlewares/tokenValidator"));
const requireAuth_1 = __importDefault(require("../../middlewares/requireAuth"));
const initiatePayment_1 = __importDefault(require("./transactionController/initiatePayment"));
const router = (0, express_1.Router)();
router.post("/payment", (0, inputValidator_1.default)(transaction_validators_1.initiatePaymentSchema), tokenValidator_1.default, requireAuth_1.default, initiatePayment_1.default);
router.post("/webhook", txWebhook_1.default);
const txRouter = router;
exports.default = txRouter;
//# sourceMappingURL=transaction.routes.js.map