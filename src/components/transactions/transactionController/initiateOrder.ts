import { Response } from "express";
import { z } from "zod";
import { ClientSession, startSession } from "mongoose";
import Currency from "currency.js";

import { initiateOrderSchema } from "../transaction.validators";

import {
  abortSessionWithResponse,
  commitSessionWithResponse,
  responseHandler,
} from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import TxModel from "../transaction.model";
import ProductModel from "../../Products/product.model";

async function initiateOrder(req: IRequest, res: Response) {
  const { user } = req;

  const {
    idempotencyKey,
    productId,
    currency,
    quantity,
  }: z.infer<typeof initiateOrderSchema> = req.body;

  const session = await startSession();
  session.startTransaction();

  try {
  } catch (err) {}
}
