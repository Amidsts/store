import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import {
  responseHandler
} from "../../../utils/response";
import { signInSchema } from "../auth.validators";
import UserModel from "../../Users/user.model";
import AuthModel from "../auth.model";

async function signIn(req: IRequest, res: Response) {
  const { email, password }: z.infer<typeof signInSchema> = req.body;

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

    if (!userAuth.comparePassword(password)) {

      return responseHandler({
        res,
        message: "Invalid login credentials",
        status: 401,
      });
    }

    const token = userAuth.generateToken({
      data: {
        ref: existingUser._id,
        role: userAuth.role,
      },
    });

    return responseHandler({
      res,
      message: "Login successful, Welcome 🤗",
      data: {
        token,
        profile: existingUser,
      },
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

export default signIn;
