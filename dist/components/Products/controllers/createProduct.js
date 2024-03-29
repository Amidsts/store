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
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, category, description, price, quantityInStock, } = req.body;
        const { userAuth } = req;
        try {
            const product = yield product_model_1.default.findOne({
                User: userAuth._id,
                name,
                category,
            });
            if (product) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "this product already exists",
                    status: 400,
                });
            }
            const newProduct = yield new product_model_1.default({
                User: userAuth._id,
                name,
                category,
                description,
                price,
                quantityInStock,
            }).save();
            return (0, response_1.responseHandler)({
                res,
                message: "product created successfully",
                data: {
                    product: newProduct,
                },
            });
        }
        catch (err) {
            (0, response_1.responseHandler)({
                res,
                err,
                message: `Internal Server Error: ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = createProduct;
//# sourceMappingURL=createProduct.js.map