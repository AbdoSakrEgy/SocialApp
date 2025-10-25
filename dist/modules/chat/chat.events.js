"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvents = void 0;
const chat_socket_service_1 = require("./chat.socket.service");
class ChatEvents {
    chatSocketServices = new chat_socket_service_1.ChatSocketServices();
    constructor() { }
    sayHi = async (socket) => {
        socket.on("sayHi", (arg, callback) => {
            return this.chatSocketServices.sayHi(arg, callback);
        });
    };
    sendMessage = async (socket) => {
        socket.on("sendMessage", (arg, callback) => {
            return this.chatSocketServices.sendMessage(socket, arg);
        });
    };
}
exports.ChatEvents = ChatEvents;
