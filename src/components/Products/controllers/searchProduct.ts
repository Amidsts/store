import { Response } from "express";
import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import { z } from "zod";
import ProductModel from "../product.model";
import handlePaginate from "../../../utils/paginate";
import { searchProductSchema } from "../product.validators";

async function searchProduct(req: IRequest, res: Response) {
  const { id, search }: z.infer<typeof searchProductSchema> = req.query;
  const { user: currentUser } = req;

  const { paginationOptions, meta } = handlePaginate(req);
  try {
    if (!req.query) {
      const products = await ProductModel.find({}, null, paginationOptions);

      return responseHandler({
        res,
        message: "products retrieved successfully",
        data: {
          products,
          meta,
        },
      });
    }

    if (id) {
      const product = await ProductModel.findById(id);
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

    const products = await ProductModel.find(
      {
        $text: { $search: search as string },
      },
      null,
      paginationOptions
    );

    return responseHandler({
      res,
      message: "products retrieved successfully",
      data: {
        products,
        meta,
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
