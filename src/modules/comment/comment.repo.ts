import { IComment, CommentModel } from "./comment.model";
import { Model } from "mongoose";
import { DBRepo } from "../../DB/db.repo";

export class CommentRepo extends DBRepo<IComment> {
  constructor(
    protected override readonly model: Model<IComment> = CommentModel
  ) {
    super(model);
  }
}
