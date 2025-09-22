import { Response } from "express";

export const successHandler = ({
  res,
  message = "Done",
  status = 200,
  result = {},
}: {
  res: Response;
  message?: string;
  status?: number;
  result?: Object;
}): Response => {
  return res.status(status).json({ message, status, result });
};
