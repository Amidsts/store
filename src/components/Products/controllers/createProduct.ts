import { Response } from "express";
import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import { z } from "zod";
import { createProductSchema } from "../product.validators";
import ProductModel from "../product.model";

async function createProduct(req: IRequest, res: Response) {
  const {
    name,
    category,
    description,
    price,
    quantityInStock,
  }: z.infer<typeof createProductSchema> = req.body;

  const { userAuth } = req;
  try {
    const product = await ProductModel.findOne({
      User:userAuth._id,
      name,
      category,
    });

    if (product) {
      return responseHandler({
        res,
        message: "this product already exists",
        status: 400,
      });
    }

    const newProduct = await new ProductModel({
      User: userAuth._id,
      name,
      category,
      description,
      price,
      quantityInStock,
    }).save();

    return responseHandler({
      res,
      message: "product created successfully",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    responseHandler({
      res,
      err,
      message: `Internal Server Error: ${err.message}`,
      status: 500,
    });
  }
}

export default createProduct;
