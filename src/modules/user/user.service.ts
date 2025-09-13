import { NextFunction, Request, Response } from "express";
import { ApplicationExpection, ValidationError } from "../../utils/Error";
import { signupSchema } from "./user.validation";

interface IUserServices {
  signUp(req: Request, res: Response, next: NextFunction): Promise<Response>;
  login(req: Request, res: Response, next: NextFunction): Response;
  getUser(req: Request, res: Response, next: NextFunction): Response;
}

export class UserServices implements IUserServices {
  constructor() { }
  async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { name, email, password } = req.body;
    const result = await signupSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ validationError: JSON.parse(result.error.message) });
    }
    return res.status(201).json({ message: "Done", result });
  }
  login(req: Request, res: Response, next: NextFunction): Response {
    return res.status(201).json({ message: "Done" });
  }
  getUser(req: Request, res: Response, next: NextFunction): Response {
    return res.status(201).json({ message: "Done" });
  }
}
