"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inputValidator_1 = __importDefault(require("../../middlewares/inputValidator"));
const product_validators_1 = require("./product.validators");
const tokenValidator_1 = __importDefault(require("../../middlewares/tokenValidator"));
const requireAuth_1 = __importDefault(require("../../middlewares/requireAuth"));
const createProduct_1 = __importDefault(require("./controllers/createProduct"));
const deleteProduct_1 = __importDefault(require("./controllers/deleteProduct"));
const editProduct_1 = __importDefault(require("./controllers/editProduct"));
const searchProduct_1 = __importDefault(require("./controllers/searchProduct"));
const router = (0, express_1.Router)();
router.post("/", (0, inputValidator_1.default)(product_validators_1.createProductSchema), tokenValidator_1.default, requireAuth_1.default, createProduct_1.default);
router.delete("/:productId", (0, inputValidator_1.default)(product_validators_1.deleteProductSchema, "params"), tokenValidator_1.default, requireAuth_1.default, deleteProduct_1.default);
router.put("/", (0, inputValidator_1.default)(product_validators_1.editProductSchema), tokenValidator_1.default, requireAuth_1.default, editProduct_1.default);
router.get("/", (0, inputValidator_1.default)(product_validators_1.searchProductSchema, "query"), tokenValidator_1.default, requireAuth_1.default, searchProduct_1.default);
const productRouter = router;
exports.default = productRouter;
//# sourceMappingURL=product.routes.js.map