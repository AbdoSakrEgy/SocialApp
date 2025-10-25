import { ApplicationExpection } from "../Errors";
import { AuthSocket, connectedSockets } from "./socketio.server";
import { UserRepo } from "../../modules/user/user.repo";
import { ChatRepo } from "../../modules/chat/chat.repo";

export class SocketioServices {
  private userModel = new UserRepo();
  private chatModel = new ChatRepo();

  constructor() {}
  // ========================== sayHi ==========================
  sayHi = async (socket: AuthSocket) => {
    socket.on("sayHi", (arg: string, callback: Function) => {
      console.log("hi");
      callback("done");
    });
  };
  // ========================== sendMessage ==========================
  sendMessage = async (socket: AuthSocket) => {
    socket.on(
      "sendMessage",
      async (arg: { sendTo: string; content: string }, callback: Function) => {
        try {
          const createdBy = socket.user?._id;
          const to = await this.userModel.findOne({
            filter: { _id: arg.sendTo },
          });
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
            $push: { message: { content: arg.content, createdBy } },
          });
          socket.emit("successMessage", arg.content);
          socket
            .to(connectedSockets.get(to._id.toString() as string) || [])
            .emit("newMessage", {
              content: arg.content,
              from: socket.user,
            });
        } catch (err) {
          socket.emit("custom_error", err);
        }
      }
    );
  };
}
