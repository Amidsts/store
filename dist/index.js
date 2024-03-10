"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const configs_1 = __importDefault(require("./configs"));
const { port, environment } = configs_1.default;
(() => {
    app_1.default.listen(port, () => {
        console.log(`${environment === null || environment === void 0 ? void 0 : environment.toLocaleUpperCase()} is running on port ${port}`);
    });
})();
//# sourceMappingURL=index.js.map