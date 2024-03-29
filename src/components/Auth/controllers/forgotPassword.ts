import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import { responseHandler } from "../../../utils/response";
import { forgotPasswordSchema } from "../auth.validators";
import OtpModel from "../otp.model";
import AuthModel from "../auth.model";
import sendEmail from "../../../configs/mail/mailTemplates";

async function forgotPassword(req: IRequest, res: Response) {
  const { email }: z.infer<typeof forgotPasswordSchema> = req.body;

  try {
    const existingUser = await AuthModel.findOne({ email });
    if (!existingUser) {
      return responseHandler({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const verificationCode = existingUser.randomOTP();

    await new OtpModel({
      User: existingUser._id,
      code: verificationCode,
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: "reset_password",
      isVerified: false,
    }).save();


    await sendEmail(
      "forgotPasswordEmail",
      existingUser.email,
      existingUser.fullName,
      verificationCode
    );

    return responseHandler({
      res,
      message: "verification code has been sent to your mail",
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

export default forgotPassword;
