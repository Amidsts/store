"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProductTestData = exports.productTestData = void 0;
const product_model_1 = __importDefault(require("../../../components/Products/product.model"));
exports.productTestData = {
    name: "sneakers",
    category: "footwear",
    description: "nsdb ekq qkf",
    price: 200,
    quantityInStock: 15,
};
function saveProductTestData() {
    return {
        product: (userId) => new product_model_1.default(Object.assign(Object.assign({}, exports.productTestData), { User: userId })),
    };
}
exports.saveProductTestData = saveProductTestData;
//# sourceMappingURL=productTestData.js.map