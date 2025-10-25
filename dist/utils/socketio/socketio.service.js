"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioServices = void 0;
const Errors_1 = require("../Errors");
const socketio_server_1 = require("./socketio.server");
const user_repo_1 = require("../../modules/user/user.repo");
const chat_repo_1 = require("../../modules/chat/chat.repo");
class SocketioServices {
    userModel = new user_repo_1.UserRepo();
    chatModel = new chat_repo_1.ChatRepo();
    constructor() { }
    // ========================== sayHi ==========================
    sayHi = async (socket) => {
        socket.on("sayHi", (arg, callback) => {
            console.log("hi");
            callback("done");
        });
    };
    // ========================== sendMessage ==========================
    sendMessage = async (socket) => {
        socket.on("sendMessage", async (arg, callback) => {
            try {
                const createdBy = socket.user?._id;
                const to = await this.userModel.findOne({
                    filter: { _id: arg.sendTo },
                });
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
                    $push: { message: { content: arg.content, createdBy } },
                });
                socket.emit("successMessage", arg.content);
                socket
                    .to(socketio_server_1.connectedSockets.get(to._id.toString()) || [])
                    .emit("newMessage", {
                    content: arg.content,
                    from: socket.user,
                });
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
}
exports.SocketioServices = SocketioServices;
