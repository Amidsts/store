import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import {
  responseHandler,
} from "../../../utils/response";
import { resetPasswordSchema } from "../auth.validators";
import OtpModel from "../otp.model";
import AuthModel from "../auth.model";

async function resetPassword(req: IRequest, res: Response) {
  const { email, confirmPassword, code }: z.infer<typeof resetPasswordSchema> =
    req.body;

  try {
    const existingUser = await AuthModel.findOne({ email });
    if (!existingUser) {
      return responseHandler({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const otp = await OtpModel.findOne({
      User: existingUser._id,
      purpose: "reset_password",
      code,
      isVerified: true,
    });
    if (!otp) {
      return responseHandler({
        res,
        status: 400,
        message: "pls, verify password otp",
      });
    }

    await OtpModel.deleteMany({
      User: existingUser._id,
      purpose: "reset_password",
    });

    existingUser.password = confirmPassword;
    await existingUser.save();

    return responseHandler({
      res,
      message: "password changed successfully, pls log in",
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

export default resetPassword;
