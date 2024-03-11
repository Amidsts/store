import { Response } from "express";
import { startSession } from "mongoose";
import { z } from "zod";

import {
  abortSessionWithResponse,
  commitSessionWithResponse,
} from "../../../utils/response";
import UserModel from "../../Users/user.model";
import { signUpSchema } from "../auth.validators";
import AuthModel from "../auth.model";
import { IRequest } from "../../../utils/types";

async function signUp(req: IRequest, res: Response) {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNo,
  }: z.infer<typeof signUpSchema> = req.body;

  const session = await startSession();
  session.startTransaction();

  try {
    const existingUser = await UserModel.findOne({
      email,
    }).session(session);

    if (existingUser) {
      return abortSessionWithResponse({
        res,
        message: "Account already exists,please Login instead ",
        status: 409,
        session,
      });
    }

    const newUser = await new UserModel({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNo,
      email,
    }).save({ session });

    await new AuthModel({
      User: newUser._id,
      password,
      isVerified: true,
      role: "user",
    }).save({ session });

    return commitSessionWithResponse({
      res,
      session,
      message: "account created, please login",
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

export default signUp;
