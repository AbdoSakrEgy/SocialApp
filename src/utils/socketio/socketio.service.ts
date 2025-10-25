import { ApplicationExpection } from "../Errors";
import { AuthSocket, connectedSockets } from "./socketio.server";
import { UserRepo } from "../../modules/user/user.repo";
import { ChatRepo } from "../../modules/chat/chat.repo";

export class SocketioServices {
  private userRepo = new UserRepo();
  private chatRepo = new ChatRepo();

  constructor() {}
  // ========================== sayHi ==========================
  sayHi = (socket: AuthSocket) => {
    socket.on("sayHi", async (arg: string, callback: Function) => {
      try {
        // console.log("hi");
        callback("done");
      } catch (err) {
        socket.emit("custom_error", err);
      }
    });
  };
  // ========================== sendMessage ==========================
  sendMessage = (socket: AuthSocket) => {
    socket.on(
      "sendMessage",
      async (arg: { sendTo: string; content: string }, callback: Function) => {
        try {
          const { sendTo, content } = arg;
          const createdBy = socket.user?._id;
          const to = await this.userRepo.findOne({
            filter: { _id: sendTo },
          });
          if (!to) {
            throw new ApplicationExpection("User not found", 404);
          }
          const chat = await this.chatRepo.findOne({
            filter: {
              participants: { $all: [to._id, createdBy] },
              group: { $exists: false },
            },
          });
          if (!chat) {
            throw new ApplicationExpection("Chat not found", 404);
          }
          await chat.updateOne({
            $push: { messages: { content: content, createdBy } },
          });
          socket.emit("successMessage", content);
          socket
            .to(connectedSockets.get(to._id.toString() as string) || [])
            .emit("newMessage", {
              content,
              from: socket.user,
            });
        } catch (err) {
          socket.emit("custom_error", err);
        }
      }
    );
  };
  // ========================== sendGroupMessage ==========================
  sendGroupMessage = (socket: AuthSocket) => {
    socket.on(
      "sendGroupMessage",
      async (arg: { content: string; groupId: string }, callback: Function) => {
        try {
          const { content, groupId } = arg;
          const createdBy = socket.user?._id;
          const group = await this.chatRepo.findOne({
            filter: {
              _id: groupId,
              participants: { $in: [socket.user?._id] },
              groupName: { $exists: true },
            },
          });
          if (!group) {
            throw new ApplicationExpection("Group not found", 404);
          }
          await group.updateOne({
            $push: { messages: { content, createdBy } },
          });
          socket.emit("successMessage", content);
          socket
            .to(groupId)
            .emit("newMessage", { content, from: socket.user, groupId });
        } catch (err) {
          socket.emit("custom_error", err);
        }
      }
    );
  };
  // ========================== joinRoom ==========================
  joinRoom = (socket: AuthSocket) => {
    socket.on(
      "join_room",
      async (arg: { groupId: string }, callback: Function) => {
        try {
          const { groupId } = arg;
          const group = await this.chatRepo.findOne({
            filter: {
              _id: groupId,
              participants: { $in: [socket.user?._id] },
              groupName: { $exists: true },
            },
          });
          if (!group) {
            throw new ApplicationExpection("Group not found", 404);
          }
          socket.join(groupId);
        } catch (err) {
          socket.emit("custom_err", err);
        }
      }
    );
  };
}
