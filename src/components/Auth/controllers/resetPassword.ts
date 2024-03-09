import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import {
  abortSessionWithResponse,
  commitSessionWithResponse,
} from "../../../utils/response";
import { resetPasswordSchema } from "../auth.validators";
import UserModel, { OtpModel } from "../../Users/user.model";
import AuthModel from "../auth.model";
import { startSession } from "mongoose";

async function resetPassword(req: IRequest, res: Response) {
  const {
    email,
    confirmPassword,
    code,
  }: z.infer<typeof resetPasswordSchema> = req.body;

  const session = await startSession();
  session.startTransaction();
  try {
    const existingUser = await UserModel.findOne({ email }).session(session);

    if (!existingUser) {
      return abortSessionWithResponse({
        res,
        session,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const userAuth = await AuthModel.findOne({
      User: existingUser._id,
    }).session(session);
    if (!userAuth) {
      return abortSessionWithResponse({
        res,
        session,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const otp = await OtpModel.findOne({
      User: existingUser._id,
      purpose: "reset-password",
      code,
      isVerified: true,
    }).session(session);
    if (!otp) {
      return abortSessionWithResponse({
        res,
        session,
        status: 400,
        message: "pls, verify password otp",
      });
    }

    await OtpModel.deleteMany({
      User: existingUser._id,
      purpose: "reset-password",
    }).session(session);

    userAuth.password = confirmPassword;
    await userAuth.save({ session });

    return commitSessionWithResponse({
      res,
      session,
      message: "password changed successfully, pls log in",
    });
  } catch (err) {
    abortSessionWithResponse({
      res,
      session,
      err,
      message: `Internal Server Error:  ${err.message}`,
      status: 500,
    });
  }
}

export default resetPassword;
