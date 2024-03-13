import { Response } from "express";
import crypto from "node:crypto";

import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import appConfig from "../../../configs";
import TxModel from "../transaction.model";

const { paystackSecret } = appConfig;

async function txWebhookHandler(req: IRequest, res: Response) {
  try {
    const hash = crypto
      .createHmac("sha512", paystackSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"])
      return res.sendStatus(400);

    res.sendStatus(200);
    const { data } = req.body;

    await TxModel.findOneAndUpdate(
      { paymentReference: data.reference },
      { $set: { status: "successful" } },
      { new: true }
    );

    return;
  } catch (err) {
    responseHandler({
      res,
      err,
      message: `Internal Server Error:  ${err.message}`,
      status: 500,
    });
  }
}

export default txWebhookHandler;
