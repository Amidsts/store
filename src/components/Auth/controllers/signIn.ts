import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../utils/types";
import { responseHandler } from "../../../utils/response";
import { signInSchema } from "../auth.validators";
import AuthModel from "../auth.model";

async function signIn(req: IRequest, res: Response) {
  const { email, password }: z.infer<typeof signInSchema> = req.body;

  try {
    const existingUser = await AuthModel.findOne({ email });

    if (!existingUser) {
      return responseHandler({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    if (!existingUser.comparePassword(password)) {
      return responseHandler({
        res,
        message: "Invalid login credentials",
        status: 401,
      });
    }

    const token = existingUser.generateToken({
      data: {
        ref: existingUser._id,
        role: existingUser.role,
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
