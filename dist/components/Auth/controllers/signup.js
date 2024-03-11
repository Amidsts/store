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
const mongoose_1 = require("mongoose");
const response_1 = require("../../../utils/response");
const user_model_1 = __importDefault(require("../../Users/user.model"));
const auth_model_1 = __importDefault(require("../auth.model"));
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, password, phoneNo, } = req.body;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const existingUser = yield user_model_1.default.findOne({
                email,
            }).session(session);
            if (existingUser) {
                return (0, response_1.abortSessionWithResponse)({
                    res,
                    message: "Account already exists,please Login instead ",
                    status: 409,
                    session,
                });
            }
            const newUser = yield new user_model_1.default({
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                phoneNo,
                email,
            }).save({ session });
            yield new auth_model_1.default({
                User: newUser._id,
                password,
                isVerified: true,
                role: "user",
            }).save({ session });
            return (0, response_1.commitSessionWithResponse)({
                res,
                session,
                message: "account created, please login",
            });
        }
        catch (err) {
            (0, response_1.abortSessionWithResponse)({
                res,
                session,
                err,
                message: `Internal Server Error:  ${err.message}`,
                status: 500,
            });
        }
    });
}
exports.default = signUp;
//# sourceMappingURL=signup.js.map