import { Response } from "express";
import { startSession } from "mongoose";
import { z } from "zod";

import { responseHandler } from "../../../utils/response";
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

  try {
    const existingUser = await AuthModel.findOne({
      email,
    });

    if (existingUser) {
      return responseHandler({
        res,
        message: "Account already exists,please Login instead",
        status: 409,
      });
    }

    await new AuthModel({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNo,
      email,
      password,
      isVerified: true,
      role: "user",
    }).save();

    return responseHandler({
      res,
      message: "account created, please login",
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

export default signUp;
