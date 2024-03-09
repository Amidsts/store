import { NextFunction, Response } from "express";
import { IRequest, IToken } from "../utils/types";
import jwt from "jsonwebtoken";
import appConfig from "../configs";
import { responseHandler } from "../utils/response";

const validateToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization as string;
  token = token?.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, appConfig.authConfigs.jwtSecret);
    req.decoded = decoded as IToken;

    return next();
  } catch (err) {
    if (err.name) {
      if (err.name === "JsonWebTokenError") {
        return responseHandler({
          res,
          message: "invalid token",
          status: 401,
          err,
        });
      } else if (err.name === "TokenExpiredError") {
        return responseHandler({
          res,
          message: "authentication expired. Please login again",
          status: 401,
          err,
        });
      }
    }
  }
};

export default validateToken;
