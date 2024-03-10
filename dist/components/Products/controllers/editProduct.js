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
const response_1 = require("../../../utils/response");
const product_model_1 = __importDefault(require("../product.model"));
function editProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { productId, name, category, description, price, quantityInStock, } = req.body;
        const { user } = req;
        try {
            const product = yield product_model_1.default.findOne({
                _id: productId,
                User: user._id,
            });
            if (!product) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "this product does not exist",
                });
            }
            const duplicateProducts = yield product_model_1.default.find({
                User: user._id,
                name,
                category,
            });
            if (duplicateProducts.length > 1) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "a product with this name already exist",
                    status: 400,
                });
            }
            product.name = name;
            product.category = category;
            product.description = description;
            product.price = price;
            product.quantityInStock = quantityInStock;
            yield product.save();
            return (0, response_1.responseHandler)({
                res,
                message: "product updated successfully",
                data: product,
            });
        }
        catch (err) {
            (0, response_1.responseHandler)({
                res,
                err,
                message: "Internal Server Error",
                status: 500,
            });
        }
    });
}
exports.default = editProduct;
//# sourceMappingURL=editProduct.js.map