import { Response } from "express";
import crypto from "node:crypto";

import { responseHandler } from "../../../utils/response";
import { IRequest } from "../../../utils/types";
import appConfig from "../../../configs";

const { paystackSecret } = appConfig;

async function txWebhookHandler(req: IRequest, res: Response) {
  try {
    const hash = crypto
      .createHmac("sha512", paystackSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      const { event, data } = req.body;
      console.log(`Paystack body  ${event} ${data.id}`);
    }
    res.send(200);
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
