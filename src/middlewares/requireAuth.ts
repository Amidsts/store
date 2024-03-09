import { NextFunction, Response } from "express";

import { IRequest } from "../utils/types";
import { responseHandler } from "../utils/response";
import UserModel from "../components/Users/user.model";
import UserAuth from "../components/Auth/auth.model";

const requireAuthMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.decoded) {
    return responseHandler({
      res,
      message: "authentication is required",
      status: 401,
    });
  }

  const { ref, role } = req.decoded;

  try {
    const user = await UserModel.findById(ref);
    if (!user) {
      return responseHandler({
        res,
        message: "authorization failed",
        status: 401,
      });
    }

    const userAuth = await UserAuth.findOne({
      User: user._id,
    });
    if (!userAuth) {
      return responseHandler({
        res,
        message: "authorization failed",
        status: 401,
      });
    }

    req.user = user;
    req.userAuth = userAuth;
    req.role = role;

    return next();
  } catch (err) {
    return responseHandler({
      res,
      message: "Authentication error",
      status: 401,
      err,
    });
  }
};
export default requireAuthMiddleware;
