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
exports.initializePayment = exports.createCustomer = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = __importDefault(require("../../configs"));
const { paystackSecret } = configs_1.default;
function createCustomer(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customerExists = yield axios_1.default.get(`https://api.paystack.co/customer/${user.email}`, {
                headers: {
                    Authorization: `Bearer ${paystackSecret}`,
                },
            });
            if (!customerExists) {
                yield axios_1.default.post("https://api.paystack.co/customer", {
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    phone: user.phoneNo,
                }, {
                    headers: {
                        Authorization: `Bearer ${paystackSecret}`,
                        "Content-Type": "application/json",
                    },
                });
            }
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createCustomer = createCustomer;
function initializePayment(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, amount, currency, }) {
        try {
            const { data } = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
                email,
                amount,
                currency,
            }, {
                headers: {
                    Authorization: `Bearer ${paystackSecret}`,
                    "Content-Type": "application/json",
                },
            });
            return data;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.initializePayment = initializePayment;
//# sourceMappingURL=transaction.utils.js.map