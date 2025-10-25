"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServices = void 0;
const user_repo_1 = require("../user/user.repo");
const Errors_1 = require("../../utils/Errors");
const chat_repo_1 = require("./chat.repo");
const successHandler_1 = require("../../utils/successHandler");
class ChatServices {
    userRepo = new user_repo_1.UserRepo();
    chatRepo = new chat_repo_1.ChatRepo();
    constructor() { }
    // ============================ getChat ============================
    getChat = async (req, res, next) => {
        const chatId = req.params.chatId;
        // step: check chat existence
        const chat = await this.chatRepo.findOne({ filter: { _id: chatId } });
        if (!chat) {
            throw new Errors_1.ApplicationExpection("Chat not found", 404);
        }
        return (0, successHandler_1.successHandler)({ res, result: { chat } });
    };
    // ============================ createChat ============================
    createChat = async (req, res, next) => {
        const user = res.locals.user;
        const userId = req.params.userId;
        // step: check users are friends
        const to = await this.userRepo.findOne({
            filter: { _id: userId, friends: { $in: [user._id] } },
        });
        if (!to) {
            throw new Errors_1.ApplicationExpection("User not found", 404);
        }
        // step: check chat existence
        const chat = await this.chatRepo.findOne({
            filter: {
                participants: {
                    $all: [to._id, user._id],
                },
                group: { $exists: false },
            },
            options: { populate: "participants" },
        });
        if (chat) {
            return (0, successHandler_1.successHandler)({ res, result: { chat } });
        }
        // step: create new chat
        const newChat = await this.chatRepo.create({
            data: {
                participants: [user._id, userId],
                createdBy: user._id,
            },
        });
        return (0, successHandler_1.successHandler)({ res, result: { chat: newChat } });
    };
    // ============================ createChatGroup ============================
    createChatGroup = async (req, res, next) => {
        const user = res.locals.user;
        const { groupName, participants } = req.body;
        // step: check participants existence
        const participantsInDB = await this.userRepo.find({
            filter: { _id: { $in: participants } },
        });
        if (participants.length != participantsInDB?.length) {
            throw new Errors_1.ApplicationExpection("Some users not found", 404);
        }
        // step: add group owner to participants
        if (!participants.includes(user._id.toString())) {
            participants.push(user._id);
        }
        // step: check group existence
        const group = await this.chatRepo.findOne({
            filter: { groupName, createdBy: user._id },
        });
        if (group) {
            return (0, successHandler_1.successHandler)({
                res,
                message: "Group created successfully",
                result: { group },
            });
        }
        // step: creat new group
        const newGroup = await this.chatRepo.create({
            data: {
                participants,
                groupName,
                createdBy: user._id,
            },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Group created successfully",
            result: { group: newGroup },
        });
    };
}
exports.ChatServices = ChatServices;
