import { model, Schema } from "mongoose";


export interface IComment {
  _id: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  parentCommentId?: Schema.Types.ObjectId | null;
  commenterId: Schema.Types.ObjectId;
  commentContent: string;
  mentions: Schema.Types.ObjectId[];
}

const commentSchema = new Schema<IComment>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    postId: { type: Schema.Types.ObjectId, ref: "post", required: true },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    commenterId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    commentContent: { type: String, required: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const CommentModel = model<IComment>("comment", commentSchema);
