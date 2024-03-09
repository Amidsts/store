import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";

import {responseHandler
 } from "../utils/response";

const validateInput =
  (schema: Schema, fieldType: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      let parsedData;
      if (fieldType === "body") {
        parsedData = schema.parse(req.body);
        req.body = parsedData;
      } else if (fieldType === "params") {
        parsedData = schema.parse(req.params);
        req.params = parsedData;
      } else if (fieldType === "query") {
        parsedData = schema.parse(req.query);
        req.query = parsedData;
      }

      return next();
    } catch (err) {
      return responseHandler({
        res,
        message: `${
          err.issues[0].path[0]
        } ${err.issues[0].message.toLowerCase()}`,
        status: 400,
      });
    }
  };

export default validateInput;
