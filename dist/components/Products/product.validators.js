"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductSchema = exports.editProductSchema = exports.deleteProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    category: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    quantityInStock: zod_1.z.number(),
});
exports.deleteProductSchema = zod_1.z.object({
    productId: zod_1.z.string(),
});
exports.editProductSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    name: zod_1.z.string(),
    category: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    quantityInStock: zod_1.z.number(),
});
exports.searchProductSchema = zod_1.z.object({
    productId: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=product.validators.js.map