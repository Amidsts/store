import { Router } from "express";
import validateInput from "../../middlewares/inputValidator";
import {
  createProductSchema,
  deleteProductSchema,
  editProductSchema,
} from "./product.validators";
import validateToken from "../../middlewares/tokenValidator";
import requireAuth from "../../middlewares/requireAuth";
import createProduct from "./controllers/createProduct";
import deleteProduct from "./controllers/deleteProduct";
import editProduct from "./controllers/editProduct";

const router = Router();

router.post(
  "/",
  validateInput(createProductSchema),
  validateToken,
  requireAuth,
  createProduct
);

router.delete(
  "/",
  validateInput(deleteProductSchema),
  validateToken,
  requireAuth,
  deleteProduct
);

router.patch(
  "/",
  validateInput(editProductSchema),
  validateToken,
  requireAuth,
  editProduct
);

router.get(
  "/",
  validateInput(editProductSchema),
  validateToken,
  requireAuth,
  editProduct
);

const productRouter = router;
export default productRouter;
