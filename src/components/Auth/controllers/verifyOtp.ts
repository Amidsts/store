import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import { verifyOtpSchema } from "../auth.validators";
import {
  responseHandler
} from "../../../utils/response";
import OtpModel from "../otp.model";
import AuthModel from "../auth.model";

async function verifyOtp(req: IRequest, res: Response) {
  const { code, email, otpPurpose }: z.infer<typeof verifyOtpSchema> = req.body;

  try {
    const userExist = await AuthModel.findOne({ email })
    if (!userExist) {
      return responseHandler({
        res,
        message: "There was a problem at this time, pls wait some minutes",
        status: 404,
      });
    }

    const otpExist = await OtpModel.findOne({
      User: userExist._id,
      code,
      purpose: otpPurpose,
    })
    if (!otpExist) {
      return responseHandler({
        res,
        message: "invalid verification code",
        status: 404,
      });
    }

    const now = new Date();

    if (now > otpExist.expireAt) {
      return responseHandler({
        res,
        message: "OTP has expired",
        status: 400,
      });
    }

    otpExist.isVerified = true;
    otpExist.expireAt = now;
    await otpExist.save();

    return responseHandler({
      res,
      message: "otp verification completed, proceed to reset your password",
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

export default verifyOtp;
