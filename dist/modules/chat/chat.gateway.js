"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const chat_events_1 = require("./chat.events");
class ChatGateway {
    chatEvents = new chat_events_1.ChatEvents();
    constructor() { }
    register = (socket) => {
        this.chatEvents.sayHi(socket);
        this.chatEvents.sendMessage(socket);
    };
}
exports.ChatGateway = ChatGateway;
