import { Response } from "express";
import { z } from "zod";
import Currency from "currency.js";

import { initiatePaymentSchema } from "../transaction.validators";
import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import ProductModel from "../../Products/product.model";
import axios from "axios";
import appConfig from "../../../configs";
import TxModel from "../transaction.model";

async function initiatePayment(req: IRequest, res: Response) {
  const { paystackSecret } = appConfig;
  const { user } = req;

  const {
    idempotencyKey,
    productId,
    currency,
    quantity,
  }: z.infer<typeof initiatePaymentSchema> = req.body;

  try {
    const product = await ProductModel.findById(productId);
    if (!product)
      return responseHandler({
        res,
        message: "product not found",
        status: 404,
      });

    if (product.User === user._id)
      return responseHandler({
        res,
        message: "you can not buy your own product",
        status: 400,
      });

    if (product.quantityInStock < 1 || quantity > product.quantityInStock)
      return responseHandler({
        res,
        message: "product is out of stock or quantity is too high",
        status: 400,
      });

    const paymentExists = await TxModel.findOne({
      Product: productId,
      idempotencyKey,
      status: "successful",
    });
    if (paymentExists)
      return responseHandler({
        res,
        message: "This payment has already been completed",
        status: 400,
      });

    const amount = Currency(product.price).multiply(quantity).value;

    const customerExists = await axios.get(
      `https://api.paystack.co/customer/${user.email}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    if (!customerExists) {
      const customer = await axios.post(
        "https://api.paystack.co/customer",
        {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phoneNo,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payload = {
      email: user.email,
      amount: `${amount}00`,
      currency,
    };

    const { data } = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status) {
      await new TxModel({
        Buyer: user._id,
        Supplier: product.User,
        idempotencyKey,
        Product: productId,
        unitPrice: product.price,
        totalPrice: amount,
        status: "pending",
        currency,
        quantity,
        paymentReference: data.data.reference,
        paymentLink: data.data.authorization_url,
      }).save();
    }

    return responseHandler({
      res,
      message: "successful",
      data,
    });
  } catch (err) {
    responseHandler({
      res,
      err,
      message: `Internal Server Error:  ${err.message}`,
      status: 500,
    });
  }
}

export default initiatePayment;
