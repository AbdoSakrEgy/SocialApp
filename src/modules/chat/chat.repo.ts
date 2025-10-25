import { Model } from "mongoose";
import { DBRepo } from "../../DB/db.repo";
import { ChatModel, IChat } from "./chat.model";

export class ChatRepo extends DBRepo<IChat> {
  constructor(protected override readonly model: Model<IChat> = ChatModel) {
    super(model);
  }
}
