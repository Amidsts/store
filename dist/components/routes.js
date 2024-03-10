"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./Auth/auth.routes"));
const transaction_routes_1 = __importDefault(require("./transactions/transaction.routes"));
const product_routes_1 = __importDefault(require("./Products/product.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/tx", transaction_routes_1.default);
router.use("/product", product_routes_1.default);
const v1Routers = router;
exports.default = v1Routers;
//# sourceMappingURL=routes.js.map