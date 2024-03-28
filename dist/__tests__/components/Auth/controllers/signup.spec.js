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
const request = require("supertest");
const app_1 = __importStar(require("../../../../app"));
const database_1 = require("../../../../configs/database");
const auth_model_1 = __importDefault(require("../../../../components/Auth/auth.model"));
const authTestData_1 = require("../authTestData");
const response = __importStar(require("../../../../utils/response"));
describe("user signup", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, app_1.initializeDatabase)();
        (0, app_1.initializeMiddlewares)();
        (0, app_1.initializeRoutes)();
    }));
    it("Should throw error if user already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, authTestData_1.saveTestData)().userAuth.save();
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        const { body, status } = yield request(app_1.default)
            .post("/v1/auth/signup")
            .send(authTestData_1.testUserData);
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("Account already exists,please Login instead");
        expect(status).toBe(409);
    }));
    it("should create a new user with a success message", () => __awaiter(void 0, void 0, void 0, function* () {
        const responseHandlerSpy = jest.spyOn(response, "responseHandler");
        yield auth_model_1.default.deleteMany();
        const { body, status } = yield request(app_1.default)
            .post("/v1/auth/signup")
            .send(authTestData_1.testUserData);
        expect(responseHandlerSpy).toHaveBeenCalled();
        expect(body.message).toBe("account created, please login");
        expect(status).toBe(200);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.restoreAllMocks();
        yield auth_model_1.default.deleteMany();
        yield (0, database_1.closeMongoDb)();
    }));
});
//# sourceMappingURL=signup.spec.js.map