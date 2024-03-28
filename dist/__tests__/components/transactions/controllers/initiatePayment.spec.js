"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importStar(require("../../../../app"));
const auth_model_1 = __importDefault(require("../../../../components/Auth/auth.model"));
const product_model_1 = __importDefault(require("../../../../components/Products/product.model"));
const database_1 = require("../../../../configs/database");
const authTestData_1 = require("../../Auth/authTestData");
const response = __importStar(require("../../../../utils/response"));
const paymentTestData_1 = require("../paymentTestData");
const mongoose_1 = __importDefault(require("mongoose"));
const productTestData_1 = require("../../Products/productTestData");
const transaction_model_1 = __importDefault(require("../../../../components/transactions/transaction.model"));
const payment = __importStar(require("../../../../components/transactions/transaction.utils"));
describe("Initiate payment", () => {
    let user, product, token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, app_1.initializeDatabase)();
        (0, app_1.initializeMiddlewares)();
        (0, app_1.initializeRoutes)();
        user = yield (0, authTestData_1.saveTestData)().userAuth.save();
        token = user.generateToken({
            data: { ref: user._id, role: user.role },
        });
    }));
    it("Should find a product by Id and throw error that product is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const randomId = new mongoose_1.default.Types.ObjectId();
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .post(`/v1/tx/payment`)
            .send((0, paymentTestData_1.paymentData)(String(randomId)))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("product not found");
        expect(status).toBe(404);
    }));
    it("Should find a product by Id and throw error, because the loggedInUser is the owner of the product", () => __awaiter(void 0, void 0, void 0, function* () {
        product = yield (0, productTestData_1.saveProductTestData)().product(user._id).save();
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .post(`/v1/tx/payment`)
            .send((0, paymentTestData_1.paymentData)(String(product._id)))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("you can not buy your own product");
        expect(status).toBe(400);
    }));
    it("Should throw error indicating that 'product is out of stock or quantity is too high'", () => __awaiter(void 0, void 0, void 0, function* () {
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        product.User = new mongoose_1.default.Types.ObjectId();
        yield product.save();
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .post(`/v1/tx/payment`)
            .send(Object.assign(Object.assign({}, (0, paymentTestData_1.paymentData)(String(product._id))), { quantity: 10000 }))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("product is out of stock or quantity is too high");
        expect(status).toBe(400);
    }));
    it("Should throw error indicating that payment has been completed", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, paymentTestData_1.saveTxTestData)().transaction(product, user._id).save();
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .post(`/v1/tx/payment`)
            .send((0, paymentTestData_1.paymentData)(String(product._id)))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("This payment has already been completed");
        expect(status).toBe(400);
    }));
    it("Should make payment and return a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
        yield transaction_model_1.default.deleteMany();
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const createCustomerSpy = jest.spyOn(payment, "createCustomer");
        const initializePaymentSpy = jest.spyOn(payment, "initializePayment");
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .post(`/v1/tx/payment`)
            .send((0, paymentTestData_1.paymentData)(String(product._id)))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(createCustomerSpy).toHaveBeenCalled();
        expect(initializePaymentSpy).toHaveBeenCalled();
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("successful");
        expect(status).toBe(200);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.restoreAllMocks();
        yield auth_model_1.default.deleteMany();
        yield product_model_1.default.deleteMany();
        yield transaction_model_1.default.deleteMany();
        yield (0, database_1.closeMongoDb)();
    }));
});
//# sourceMappingURL=initiatePayment.spec.js.map