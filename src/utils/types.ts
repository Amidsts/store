import { Response, Request } from "express";
import { Types, ClientSession } from "mongoose";
import { IAuth } from "../components/Auth/auth.model";

export type responseHandlerArgType = {
  res: Response;
  data?: any;
  status?: number;
  err?: any;
  message?: string;
  session?: ClientSession;
};

export interface IRequest extends Request {
  decoded?: IToken;
  role?: string;
  userAuth: IAuth;
}

export interface IToken {
  ref: Types.ObjectId;
  role: string;
}