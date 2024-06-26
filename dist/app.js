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
exports.initializeRoutes = exports.initializeMiddlewares = exports.initializeDatabase = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = __importDefault(require("./configs/database"));
const response_1 = require("./utils/response");
const auth_routes_1 = __importDefault(require("./components/Auth/auth.routes"));
const transaction_routes_1 = __importDefault(require("./components/transactions/transaction.routes"));
const product_routes_1 = __importDefault(require("./components/Products/product.routes"));
const app = (0, express_1.default)();
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, database_1.default)().catch((err) => console.log(`error: ${err.message}`));
});
exports.initializeDatabase = initializeDatabase;
const initializeMiddlewares = () => {
    const allowedOrigins = ["http://localhost:5173"];
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    };
    app
        // .use(cors(corsOptions))
        .use(express_1.default.json({ limit: "50kb" }))
        .use(express_1.default.urlencoded({ limit: "50kb", extended: false }))
        .use((0, helmet_1.default)())
        .use((err, req, res, next) => {
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
            return (0, response_1.responseHandler)({
                res,
                status: 403,
                message: "Invalid header method",
            });
        }
        if (req.body && err instanceof SyntaxError) {
            return res.status(400).json({
                message: "Malformed JSON, check the body of the request",
            });
        }
        return next();
    });
};
exports.initializeMiddlewares = initializeMiddlewares;
const initializeRoutes = () => {
    app
        .use("/v1/auth", auth_routes_1.default)
        .use("/v1/tx", transaction_routes_1.default)
        .use("/v1/product", product_routes_1.default);
    app.get("/", (req, res) => {
        res.status(200).json({ message: "welcome to The Store" });
    });
    app.all("*", (_req, res) => (0, response_1.responseHandler)({
        res,
        status: 404,
        message: "You have used an invalid method or hit an invalid route",
    }));
};
exports.initializeRoutes = initializeRoutes;
exports.default = app;
//# sourceMappingURL=app.js.map