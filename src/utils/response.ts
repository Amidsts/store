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

  export const commitSessionWithResponse = async ({
    res,
    data,
    status = 200,
    message,
    session,
    err,
  }: responseHandlerArgType) => {
    await session.commitTransaction();
    session.endSession();

    return responseHandler({ res, data, status, message, err, session });
  };

  export const abortSessionWithResponse = async ({
    res,
    data,
    status = 200,
    err,
    message,
    session,
  }: responseHandlerArgType) => {
    await session.abortTransaction();
    session.endSession();

    return responseHandler({ res, data, status, message, err, session });
  };