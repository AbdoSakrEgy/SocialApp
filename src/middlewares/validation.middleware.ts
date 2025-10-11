import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { ValidationError } from "../utils/Errors";

export const validation = (shcema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
      attachment: req.file,
      attachments: req.files,
    };
    const result = shcema.safeParse(data);
    if (result.success) {
      next();
    } else {
      const issues = result.error?.issues;
      let messages = "";
      for (let item of issues) {
        messages += item.message + " \n ";
      }
      throw new ValidationError(messages, 400);
    }
  };
};
