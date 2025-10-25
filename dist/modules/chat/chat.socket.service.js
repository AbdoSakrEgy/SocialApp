"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocketServices = void 0;
const Errors_1 = require("../../utils/Errors");
const gateway_1 = require("../gateway/gateway");
const user_repo_1 = require("../user/user.repo");
const chat_repo_1 = require("./chat.repo");
class ChatSocketServices {
    userModel = new user_repo_1.UserRepo();
    chatModel = new chat_repo_1.ChatRepo();
    constructor() { }
    sayHi = async (message, callback) => {
        console.log(message);
        callback("hello");
    };
    sendMessage = async (socket, data) => {
        try {
            const createdBy = socket.user?._id;
            const to = await this.userModel.findOne({ filter: { _id: data.sendTo } });
            if (!to) {
                throw new Errors_1.ApplicationExpection("User not found", 404);
            }
            const chat = await this.chatModel.findOne({
                filter: {
                    participants: { $all: [to._id, createdBy] },
                    group: { $exists: false },
                },
            });
            if (!chat) {
                throw new Errors_1.ApplicationExpection("Chat not found", 404);
            }
            await chat.updateOne({
                $push: { message: { content: data.content, createdBy } },
            });
            socket.emit("successMessage", data.content);
            socket
                .to(gateway_1.connectedSockets.get(to._id.toString()) || [])
                .emit("newMessage", {
                content: data.content,
                from: socket.user,
            });
        }
        catch (err) {
            socket.emit("custom_error", err);
        }
    };
}
exports.ChatSocketServices = ChatSocketServices;
