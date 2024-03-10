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
const currency_js_1 = __importDefault(require("currency.js"));
const response_1 = require("../../../utils/response");
const product_model_1 = __importDefault(require("../../Products/product.model"));
const axios_1 = __importDefault(require("axios"));
const configs_1 = __importDefault(require("../../../configs"));
const transaction_model_1 = __importDefault(require("../transaction.model"));
function initiatePayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { paystackSecret } = configs_1.default;
        const { user } = req;
        const { idempotencyKey, productId, currency, quantity, } = req.body;
        try {
            const product = yield product_model_1.default.findById(productId);
            if (!product)
                return (0, response_1.responseHandler)({
                    res,
                    message: "product not found",
                    status: 404,
                });
            if (product.User === user._id)
                return (0, response_1.responseHandler)({
                    res,
                    message: "you can not buy your own product",
                    status: 400,
                });
            if (product.quantityInStock < 1 || quantity > product.quantityInStock)
                return (0, response_1.responseHandler)({
                    res,
                    message: "product is out of stock or quantity is too high",
                    status: 400,
                });
            const paymentExists = yield transaction_model_1.default.findOne({
                Product: productId,
                idempotencyKey,
                status: "successful",
            });
            if (paymentExists)
                return (0, response_1.responseHandler)({
                    res,
                    message: "This payment has already been completed",
                    status: 400,
                });
            const amount = (0, currency_js_1.default)(product.price).multiply(quantity).value;
            const payload = JSON.stringify({
                currency,
                amount,
                email: user.email,
            });
            const { data } = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", payload, {
                headers: {
                    Authorization: `Bearer ${paystackSecret}`,
                    "Content-Type": "application/json",
                },
            });
            if (data.status) {
                yield new transaction_model_1.default({
                    Buyer: user._id,
                    Supplier: product.User,
                    idempotencyKey,
                    Product: productId,
                    unitPrice: product.price,
                    totalPrice: amount,
                    status: "pending",
                    currency,
                    quantity,
                    paymentReference: data.data.reference,
                    paymentLink: data.data.authorization_url,
                }).save();
            }
            return (0, response_1.responseHandler)({
                res,
                message: "successful",
                data,
            });
        }
        catch (err) {
            (0, response_1.responseHandler)({
                res,
                err,
                message: `Internal Server Error:  ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = initiatePayment;
//# sourceMappingURL=initiatePayment.js.map