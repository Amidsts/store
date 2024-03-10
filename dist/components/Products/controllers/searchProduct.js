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
const paginate_1 = __importDefault(require("../../../utils/paginate"));
function searchProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, search } = req.query;
        const { user: currentUser } = req;
        const { paginationOptions, meta } = (0, paginate_1.default)(req);
        try {
            if (!req.query) {
                const products = yield product_model_1.default.find({}, null, paginationOptions);
                return (0, response_1.responseHandler)({
                    res,
                    message: "products retrieved successfully",
                    data: {
                        products,
                        meta,
                    },
                });
            }
            if (id) {
                const product = yield product_model_1.default.findById(id);
                if (!product) {
                    return (0, response_1.responseHandler)({
                        res,
                        message: "product does not exist",
                        status: 400,
                    });
                }
                return (0, response_1.responseHandler)({
                    res,
                    message: "product retrieved successfully",
                    data: product,
                });
            }
            const products = yield product_model_1.default.find({
                $text: { $search: search },
            }, null, paginationOptions);
            return (0, response_1.responseHandler)({
                res,
                message: "products retrieved successfully",
                data: {
                    products,
                    meta,
                },
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
exports.default = searchProduct;
//# sourceMappingURL=searchProduct.js.map