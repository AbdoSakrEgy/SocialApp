import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import { successHandler } from "../../utils/successHandler";

interface IPostServices {
  allPosts(req: Request, res: Response, next: NextFunction): Promise<Response>;
  createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

class PostServices implements IPostServices {
  constructor() {}

  // ============================ createPost ============================
  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    
    return successHandler({ res });
  };

  // ============================ allPosts ============================
  allPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return successHandler({ res });
  };
}

export default PostServices;
