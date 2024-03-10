import { Router } from "express";
import authRouter from "./Auth/auth.routes";
import txRouter from "./transactions/transaction.routes";
import productRouter from "./Products/product.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/tx", txRouter);
router.use("/product", productRouter);

const v1Routers = router;
export default v1Routers;
