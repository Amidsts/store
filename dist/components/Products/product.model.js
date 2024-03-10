"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    User: mongoose_1.Schema.Types.ObjectId,
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
});
productSchema.index({
    productName: "text",
    category: "text",
    description: "text",
});
const ProductModel = (0, mongoose_1.model)("Product", productSchema);
exports.default = ProductModel;
//# sourceMappingURL=product.model.js.map