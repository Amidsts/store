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
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req;
        const { productId } = req.params;
        try {
            const deleteProduct = yield product_model_1.default.findOneAndDelete({
                _id: productId,
                User: user._id,
            });
            if (!deleteProduct) {
                return (0, response_1.responseHandler)({
                    res,
                    message: "this product does not exist",
                });
            }
            return (0, response_1.responseHandler)({
                res,
                message: "product deleted successfully",
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
exports.default = deleteProduct;
//# sourceMappingURL=deleteProduct.js.map