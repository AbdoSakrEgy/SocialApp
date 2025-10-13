import { Model } from "mongoose";
import { DBRepo } from "../../DB/db.repo";
import { IPost, PostModel } from "./post.model";

export class PostRepo extends DBRepo<IPost> {
    
  constructor(protected override readonly model: Model<IPost> = PostModel) {
    super(model);
  }
}
