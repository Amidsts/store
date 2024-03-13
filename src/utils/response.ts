import { Response } from "express"
import {responseHandlerArgType} from "./types"

export const responseHandler = ({
  res,
  data,
  status = 200,
  err,
  message,
}: responseHandlerArgType): Response =>
  res.status(status).json({
    message,
    data,
    err
  });
