import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import { verifyOtpSchema } from "../auth.validators";
import {
  abortSessionWithResponse,
  commitSessionWithResponse,
} from "../../../utils/response";
import UserModel, { OtpModel } from "../../Users/user.model";
import AuthModel from "../auth.model";
import { startSession } from "mongoose";

async function verifyOtp(req: IRequest, res: Response) {
  const { code, email, otpPurpose }: z.infer<typeof verifyOtpSchema> = req.body;

  const session = await startSession();
  session.startTransaction();
  try {
    const userExist = await UserModel.findOne({ email }).session(session);
    if (!userExist) {
      return abortSessionWithResponse({
        res,
        session,
        message: "There was a problem at this time, pls wait some minutes",
        status: 404,
      });
    }

    const userAuth = await AuthModel.findOne({ User: userExist._id }).session(
      session
    );
    if (!userAuth) {
      return abortSessionWithResponse({
        res,
        session,
        message: "There was a problem at this time, pls wait some minutes",
        status: 404,
      });
    }

    const otpExist = await OtpModel.findOne({
      User: userExist._id,
      code,
      purpose: otpPurpose,
    }).session(session);
    if (!otpExist) {
      return abortSessionWithResponse({
        res,
        session,
        message: "invalid verification code",
        status: 404,
      });
    }

    const now = new Date();

    if (now > otpExist.expireAt) {
      return abortSessionWithResponse({
        res,
        session,
        message: "OTP has expired",
        status: 400,
      });
    }

    otpExist.isVerified = true;
    otpExist.expireAt = now;
    await otpExist.save({ session });

    return commitSessionWithResponse({
      res,
      session,
      message: "otp verification completed, proceed to reset your password",
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

export default verifyOtp;
