"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    User: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantityInStock: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const ProductModel = (0, mongoose_1.model)("Product", productSchema);
exports.default = ProductModel;
//# sourceMappingURL=product.model.js.map