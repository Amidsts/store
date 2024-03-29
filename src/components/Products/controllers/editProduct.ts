import { Response } from "express";
import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import { z } from "zod";
import { editProductSchema } from "../product.validators";
import ProductModel from "../product.model";

async function editProduct(req: IRequest, res: Response) {
  const {
    productId,
    name,
    category,
    description,
    price,
    quantityInStock,
  }: z.infer<typeof editProductSchema> = req.body;

  const { userAuth } = req;
  try {
    const product = await ProductModel.findOne({
      _id: productId,
      User: userAuth._id,
    });
    if (!product) {
      return responseHandler({
        res,
        message: "This product does not exist",
        status: 400,
      });
    }

    product.name = name;
    product.category = category;
    product.description = description;
    product.price = price;
    product.quantityInStock = quantityInStock;

    await product.save();
    return responseHandler({
      res,
      message: "product updated successfully",
      data: product,
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

export default editProduct;
