import { ApplicationExpection } from "../../utils/Errors";
import { AuthSocket, connectedSockets } from "../gateway/gateway";
import { UserRepo } from "../user/user.repo";
import { ChatRepo } from "./chat.repo";

export class ChatSocketServices {
  private userModel = new UserRepo();
  private chatModel = new ChatRepo();

  constructor() {}
  sayHi = async (message: string, callback: Function) => {
    console.log(message);
    callback("hello");
  };
  sendMessage = async (
    socket: AuthSocket,
    data: { sendTo: string; content: string }
  ) => {
    try {
      const createdBy = socket.user?._id;
      const to = await this.userModel.findOne({ filter: { _id: data.sendTo } });
      if (!to) {
        throw new ApplicationExpection("User not found", 404);
      }
      const chat = await this.chatModel.findOne({
        filter: {
          participants: { $all: [to._id, createdBy] },
          group: { $exists: false },
        },
      });
      if (!chat) {
        throw new ApplicationExpection("Chat not found", 404);
      }
      await chat.updateOne({
        $push: { message: { content: data.content, createdBy } },
      });
      socket.emit("successMessage", data.content);
      socket
        .to(connectedSockets.get(to._id.toString() as string) || [])
        .emit("newMessage", {
          content: data.content,
          from: socket.user,
        });
    } catch (err) {
      socket.emit("custom_error", err);
    }
  };
}
