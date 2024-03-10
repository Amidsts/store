import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import { responseHandler } from "../../../utils/response";
import { forgotPasswordSchema } from "../auth.validators";
import UserModel, { OtpModel } from "../../Users/user.model";
import AuthModel from "../auth.model";
import sendEmail from "../../../configs/mail/mailTemplates";

async function forgotPassword(req: IRequest, res: Response) {
  const { email }: z.infer<typeof forgotPasswordSchema> = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return responseHandler({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const userAuth = await AuthModel.findOne({
      User: existingUser._id,
    });
    if (!userAuth) {
      return responseHandler({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const verificationCode = userAuth.randomOTP();

    await new OtpModel({
      User: existingUser._id,
      code: verificationCode,
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: "reset_password",
      isVerified: false,
    }).save();

    // await sendForgotPasswordEmail(
    //   existingUser.email,
    //   existingUser.firstName,
    //   verificationCode
    // );

    // await sendEmail("forgotPasswordEmail")[]
    console.log("verification code:  ", verificationCode)

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
