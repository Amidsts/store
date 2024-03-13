import { Response } from "express";
import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import { z } from "zod";
import ProductModel from "../product.model";
import handlePaginate from "../../../utils/paginate";
import { searchProductSchema } from "../product.validators";

async function searchProduct(req: IRequest, res: Response) {
  const { productId, search }: z.infer<typeof searchProductSchema> = req.query;

  const { paginationOptions } = handlePaginate(req);
  try {
    if (productId) {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return responseHandler({
          res,
          message: "product does not exist",
          status: 400,
        });
      }

      return responseHandler({
        res,
        message: "product retrieved successfully",
        data: product,
      });
    }

    if (search) {
      const products = await ProductModel.find(
        {
          name: { $regex: search, $options: "i" },
        },
        null,
        paginationOptions
      );

      return responseHandler({
        res,
        message: "products retrieved successfully",
        data: {
          products,
        },
      });
    }

    const products = await ProductModel.find({}, null, paginationOptions);

    return responseHandler({
      res,
      message: "products retrieved successfully",
      data: {
        products,
      },
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

export default searchProduct;
