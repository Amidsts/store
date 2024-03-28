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
const database_1 = require("../../../../configs/database");
const authTestData_1 = require("../../Auth/authTestData");
const productTestData_1 = require("../productTestData");
const product_model_1 = __importDefault(require("../../../../components/Products/product.model"));
const response = __importStar(require("../../../../utils/response"));
describe("Delete a product", () => {
    let user, product, token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, app_1.initializeDatabase)();
        (0, app_1.initializeMiddlewares)();
        (0, app_1.initializeRoutes)();
        user = yield (0, authTestData_1.saveTestData)().userAuth.save();
        product = yield (0, productTestData_1.saveProductTestData)().product(user._id).save();
        token = user.generateToken({ data: { ref: user._id, role: user.role } });
    }));
    it("Should find a product with 'findOne()' and throw error that product does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield product_model_1.default.deleteMany();
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .put(`/v1/product`)
            .send(Object.assign(Object.assign({}, productTestData_1.productTestData), { productId: product._id }))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("This product does not exist");
        expect(status).toBe(400);
    }));
    it("Should find a product with 'findOne()' and edit", () => __awaiter(void 0, void 0, void 0, function* () {
        product = yield (0, productTestData_1.saveProductTestData)().product(user._id).save();
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const { body, status } = yield (0, supertest_1.default)(app_1.default)
            .put(`/v1/product`)
            .send(Object.assign(Object.assign({}, productTestData_1.productTestData), { productId: product._id, name: "necklace", category: "accessories" }))
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("product updated successfully");
        expect(status).toBe(200);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.restoreAllMocks();
        yield auth_model_1.default.deleteMany();
        yield product_model_1.default.deleteMany();
        yield (0, database_1.closeMongoDb)();
    }));
});
//# sourceMappingURL=editProduct.spec.js.map