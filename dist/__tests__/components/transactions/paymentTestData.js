"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTxTestData = exports.paymentData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = __importDefault(require("../../../components/transactions/transaction.model"));
const paymentData = (productId) => ({
    idempotencyKey: "ajhuqhgewlwDBJHBG",
    productId,
    currency: "NGN",
    quantity: 2,
});
exports.paymentData = paymentData;
function saveTxTestData() {
    return {
        transaction: (product, userId) => new transaction_model_1.default({
            Product: product._id,
            idempotencyKey: (0, exports.paymentData)(product._id).idempotencyKey,
            status: "successful",
            Supplier: new mongoose_1.default.Types.ObjectId(),
            Buyer: userId,
            currency: (0, exports.paymentData)(product._id).currency,
            unitPrice: product.price,
            quantity: (0, exports.paymentData)(product._id).quantity,
        }),
    };
}
exports.saveTxTestData = saveTxTestData;
//# sourceMappingURL=paymentTestData.js.map