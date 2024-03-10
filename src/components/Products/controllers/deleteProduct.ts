import { Response } from "express";
import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import { z } from "zod";
import { deleteProductSchema } from "../product.validators";
import ProductModel from "../product.model";

async function deleteProduct(req: IRequest, res: Response) {
  const { user } = req;
  const { productId }: z.infer<typeof deleteProductSchema> = req.params;

  try {
    const deleteProduct = await ProductModel.findOneAndDelete({
      _id: productId,
      User: user._id,
    });

    if (!deleteProduct) {
      return responseHandler({
        res,
        message: "this product does not exist",
      });
    }

    return responseHandler({
      res,
      message: "product deleted successfully",
    });
  } catch (err) {
    responseHandler({
      res,
      err,
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export default deleteProduct;
