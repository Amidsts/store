"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const txSchema = new mongoose_1.Schema({
    idempotencyKey: String,
    Supplier: mongoose_1.Schema.Types.ObjectId,
    Buyer: mongoose_1.Schema.Types.ObjectId,
    Product: mongoose_1.Schema.Types.ObjectId,
    currency: {
        type: String,
        enum: ["NGN", "USD"],
    },
    unitPrice: Number,
    quantity: Number,
    totalPrice: Number,
    status: {
        type: String,
        enum: ["pending", "successful", "failed"],
    },
    paymentReference: String,
    paymentLink: String,
});
const TxModel = (0, mongoose_1.model)("Transaction", txSchema);
exports.default = TxModel;
//# sourceMappingURL=transaction.model.js.map