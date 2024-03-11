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

  const { user } = req;
  try {

    const product = await ProductModel.findOne({
      _id: productId,
      User: user._id,
    });
    if (!product) {
      return responseHandler({
        res,
        message: "this product does not exist",
      });
    }

    const duplicateProducts = await ProductModel.find({
      User: user._id,
      name,
      category,
    });
    if (duplicateProducts.length > 1) {
      return responseHandler({
        res,
        message: "a product with this name already exist",
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
