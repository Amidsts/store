import { Router } from "express";
import validateInput from "../../middlewares/inputValidator";
import {
  createProductSchema,
  deleteProductSchema,
  editProductSchema,
  searchProductSchema,
} from "./product.validators";
import validateToken from "../../middlewares/tokenValidator";
import requireAuth from "../../middlewares/requireAuth";
import createProduct from "./controllers/createProduct";
import deleteProduct from "./controllers/deleteProduct";
import editProduct from "./controllers/editProduct";
import searchProduct from "./controllers/searchProduct";

const router = Router();

router.post(
  "/",
  validateInput(createProductSchema),
  validateToken,
  requireAuth,
  createProduct
);

router.delete(
  "/:productId",
  validateInput(deleteProductSchema, "params"),
  validateToken,
  requireAuth,
  deleteProduct
);

router.put(
  "/",
  validateInput(editProductSchema),
  validateToken,
  requireAuth,
  editProduct
);

router.get(
  "/",
  validateInput(searchProductSchema, "query"),
  validateToken,
  requireAuth,
  searchProduct
);


const productRouter = router;
export default productRouter;
