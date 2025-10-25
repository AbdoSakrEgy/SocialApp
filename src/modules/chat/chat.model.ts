import mongoose, {
  HydratedDocument,
  model,
  models,
  Schema,
  Types,
} from "mongoose";

export interface IMessage {
  createdBy: Types.ObjectId;
  content: string;
  createdAt: Date;
  updateAt: Date;
}
export interface IChat {
  // OVO => one to one
  participants: Types.ObjectId[];
  messages: IMessage[];
  // OVM => one to many
  groupName?: string;
  groupImage: string;
  // common
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type HMessageDocument = HydratedDocument<IMessage>;
export type HChatDocument = HydratedDocument<IChat>;

export const messageSchema = new Schema<IMessage>(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    messages: [messageSchema],
    groupName: { type: String },
    groupImage: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const ChatModel = models.chat || model<IChat>("chat", chatSchema);
