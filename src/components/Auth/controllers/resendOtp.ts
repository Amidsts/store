import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import { responseHandler } from "../../../utils/response";
import { resendOtpSchema } from "../auth.validators";
import UserModel, { OtpModel } from "../../Users/user.model";
import AuthModel from "../auth.model";

async function resendOtp(req: IRequest, res: Response) {
  const { email, otpPurpose }: z.infer<typeof resendOtpSchema> = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return responseHandler({
        res,
        status: 404,
        message: "invalid credentials",
      });
    }

    const userAuth = await AuthModel.findOne({ User: user._id });
    if (!userAuth) {
      return responseHandler({
        res,
        message: "invalid credentials",
        status: 404,
      });
    }

    const verificationCode = userAuth.randomOTP();

    await new OtpModel({
      User: user._id,
      code: verificationCode,
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: otpPurpose,
    }).save();

    //send a mail
    console.log("user verification:  ", verificationCode);
    

    return responseHandler({
      res,
      message: "verification code has been sent to your mail",
    });
  } catch (err) {
    return responseHandler({
      res,
      message: `Internal Server Error:  ${err.message}`,
      status: 500,
    });
  }
}

export default resendOtp;
