"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePaymentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.initiatePaymentSchema = zod_1.default.object({
    idempotencyKey: zod_1.default.string().optional(),
    productId: zod_1.default.string(),
    currency: zod_1.default.enum(["NGN", "USD"]),
    quantity: zod_1.default.number().default(1).optional(),
});
//# sourceMappingURL=transaction.validators.js.map