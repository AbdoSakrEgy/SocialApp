"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioServices = void 0;
const Errors_1 = require("../Errors");
const socketio_server_1 = require("./socketio.server");
const user_repo_1 = require("../../modules/user/user.repo");
const chat_repo_1 = require("../../modules/chat/chat.repo");
const chat_validation_1 = require("../../modules/chat/chat.validation");
class SocketioServices {
    userRepo = new user_repo_1.UserRepo();
    chatRepo = new chat_repo_1.ChatRepo();
    constructor() { }
    // ========================== sayHi ==========================
    sayHi = (socket) => {
        socket.on("sayHi", async (arg, callback) => {
            try {
                // console.log("hi");
                callback("done");
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== isUserTyping ==========================
    isUserTyping = (socket) => {
        socket.on("isUserTyping", async (arg, callback) => {
            try {
                const { sendTo, isTyping } = arg;
                socket.to(sendTo).emit("is_user_typing", isTyping);
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== isUserOnline ==========================
    isUserOnline = (socket) => {
        socket.on("isUserOnline", async (arg, callback) => {
            try {
                const { sendTo, isOnline } = arg;
                socket.to(sendTo).emit("is_user_online", isOnline);
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== sendMessage ==========================
    sendMessage = (socket) => {
        socket.on("sendMessage", async (arg, callback) => {
            try {
                const { sendTo, content } = chat_validation_1.chatMessageSchema.parse(arg);
                const createdBy = socket.user?._id;
                const to = await this.userRepo.findOne({
                    filter: { _id: sendTo },
                });
                if (!to) {
                    throw new Errors_1.ApplicationExpection("User not found", 404);
                }
                const chat = await this.chatRepo.findOne({
                    filter: {
                        participants: { $all: [to._id, createdBy] },
                        group: { $exists: false },
                    },
                });
                if (!chat) {
                    throw new Errors_1.ApplicationExpection("Chat not found", 404);
                }
                await chat.updateOne({
                    $push: { messages: { content: content, createdBy } },
                });
                socket.emit("successMessage", content);
                socket
                    .to(socketio_server_1.connectedSockets.get(to._id.toString()) || [])
                    .emit("newMessage", {
                    content,
                    from: socket.user,
                });
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== joinRoom ==========================
    joinRoom = (socket) => {
        socket.on("join_room", async (arg, callback) => {
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
                    throw new Errors_1.ApplicationExpection("Group not found", 404);
                }
                socket.join(groupId);
            }
            catch (err) {
                socket.emit("custom_err", err);
            }
        });
    };
    // ========================== sendGroupMessage ==========================
    sendGroupMessage = (socket) => {
        socket.on("sendGroupMessage", async (arg, callback) => {
            try {
                const { content, groupId } = chat_validation_1.chatGroupMessageSchema.parse(arg);
                const createdBy = socket.user?._id;
                const group = await this.chatRepo.findOne({
                    filter: {
                        _id: groupId,
                        participants: { $in: [socket.user?._id] },
                        groupName: { $exists: true },
                    },
                });
                if (!group) {
                    throw new Errors_1.ApplicationExpection("Group not found", 404);
                }
                await group.updateOne({
                    $push: { messages: { content, createdBy } },
                });
                socket.emit("successMessage", content);
                socket
                    .to(groupId)
                    .emit("newMessage", { content, from: socket.user, groupId });
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
}
exports.SocketioServices = SocketioServices;
