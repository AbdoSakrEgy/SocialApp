"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvents = void 0;
const chat_socket_service_1 = require("./chat.socket.service");
class ChatEvents {
    chatSocketServices = new chat_socket_service_1.ChatSocketServices();
    constructor() { }
    sayHi = (socket) => {
        socket.on("sayHi", (message, callback) => {
            return this.chatSocketServices.sayHi(message, callback);
        });
    };
    sendMessage = async (socket) => {
        socket.on("sendMessage", (data) => {
            return this.chatSocketServices.sendMessage(socket, data);
        });
    };
}
exports.ChatEvents = ChatEvents;
