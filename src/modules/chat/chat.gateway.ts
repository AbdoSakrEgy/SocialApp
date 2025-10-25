import { AuthSocket } from "../gateway/gateway";
import { ChatEvents } from "./chat.events";

export class ChatGateway {
  private chatEvents = new ChatEvents();

  constructor() {}
  register = (socket: AuthSocket) => {
    this.chatEvents.sayHi(socket);
    this.chatEvents.sendMessage(socket,);
  };
}
