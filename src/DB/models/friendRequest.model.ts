import mongoose, { model, Schema, Types } from "mongoose";

export interface IFriendRequest {
  from: Types.ObjectId;
  to: Types.ObjectId;
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const friendRequestSchema = new Schema<IFriendRequest>(
  {
    //! from: { type: Types.ObjectId, ref: "user" },  why this line is wrong
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const FriendRequestModel = model("friendRequest", friendRequestSchema);
