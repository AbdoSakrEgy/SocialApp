import { Model } from "mongoose";
import { DBRepo } from "../db.repo";
import {
  FriendRequestModel,
  IFriendRequest,
} from "../models/friendRequest.model";

export class FriendRequestRepo extends DBRepo<IFriendRequest> {
  constructor(
    protected override readonly model: Model<IFriendRequest> = FriendRequestModel
  ) {
    super(model);
  }
}
