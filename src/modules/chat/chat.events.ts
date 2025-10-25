import { AuthSocket } from "../gateway/gateway";
import { ChatSocketServices } from "./chat.socket.service";

export class ChatEvents {
  private chatSocketServices = new ChatSocketServices();

  constructor() {}
  sayHi = (socket: AuthSocket) => {
    socket.on("sayHi", (message: string, callback: Function) => {
      return this.chatSocketServices.sayHi(message, callback);
    });
  };
  sendMessage = async (socket: AuthSocket) => {
    socket.on("sendMessage", (data) => {
      return this.chatSocketServices.sendMessage(socket, data);
    });
  };
}
