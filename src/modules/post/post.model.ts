import mongoose, { model, Schema, Types } from "mongoose";

export interface IPost {
  content: string;
  attachments: string[]; // Array<string>
  createdBy: Types.ObjectId;
  avilableFor: string;
  isCommentsAllowed: boolean;
  likes: Types.ObjectId[]; // Array<Types.ObjectId>
  tags: Types.ObjectId[]; // Array<Types.ObjectId>
  isDeleted: boolean;
  assetsFolderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AvilableForEnum = {
  PUBLIC: "public",
  PRIVATE: "private",
  FRIENDS: "friends",
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
      enum: Object.values(AvilableForEnum),
      default: AvilableForEnum.PUBLIC,
    },
    isCommentsAllowed: { type: Boolean, default: true },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "user" },
    tags: { type: [mongoose.Schema.Types.ObjectId], ref: "user" },
    isDeleted: { type: Boolean, default: false },
    assetsFolderId: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const PostModel = model<IPost>("post", postSchema);
