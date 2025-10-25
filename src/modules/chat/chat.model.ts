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
  participants: mongoose.Schema.Types.ObjectId[];
  message: IMessage[];
  // OVM => one to many
  group?: string;
  groupImage: string;
  roomId: string;
  // common
  createdBy: mongoose.Schema.Types.ObjectId;
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    message: [messageSchema],
    group: { type: String },
    groupImage: { type: String },
    roomId: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const ChatModel = models.chat || model<IChat>("chat", chatSchema);
