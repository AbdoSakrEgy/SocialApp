import mongoose, { HydratedDocument, model, Schema, Types } from "mongoose";
import { IUser } from "../user/user.model";

export interface IPost {
  content: string;
  attachments: string[]; // Array<string>
  createdBy: Types.ObjectId;
  avilableFor: PostAvilableForEnum;
  isCommentsAllowed: boolean;
  likes: Types.ObjectId[]; // Array<Types.ObjectId>
  tags: Types.ObjectId[]; // Array<Types.ObjectId>
  isDeleted: boolean;
  assetsFolderId: string;
  comments: Array<{
    _id?: Types.ObjectId;
    commenter: Types.ObjectId;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostAvilableForEnum {
  PUBLIC = "public",
  PRIVATE = "private",
  FRIENDS = "friends",
}

export const avilabiltyConditation = (user: HydratedDocument<IUser>) => {
  return [
    {
      avilableFor: PostAvilableForEnum.PUBLIC,
    },
    {
      avilableFor: PostAvilableForEnum.PRIVATE,
      createdBy: user._id,
    },
    {
      avilableFor: PostAvilableForEnum.PRIVATE,
      tags: { $in: user._id },
    },
    {
      avilableFor: PostAvilableForEnum.FRIENDS,
      createdBy: { $in: [...user.friends, user._id] },
    },
  ];
};

const postSchema = new Schema<IPost>(
  {
    content: { type: String },
    attachments: { type: [String] },
    createdBy: {
      // type: Types.ObjectId, this line output error
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avilableFor: {
      type: String,
      enum: Object.values(PostAvilableForEnum),
      default: PostAvilableForEnum.PUBLIC,
    },
    isCommentsAllowed: { type: Boolean, default: true },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "user" },
    tags: { type: [mongoose.Schema.Types.ObjectId], ref: "user" },
    isDeleted: { type: Boolean, default: false },
    assetsFolderId: { type: String },
    comments: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        // Date.now => you are passing the function reference — not calling it yet
        // Date.now() => you are calling the function immediately, right when the schema is defined
        // Date.now => return number, but mongoosy automatically converts it to a Date since the field type is Date
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const PostModel = model<IPost>("post", postSchema);
