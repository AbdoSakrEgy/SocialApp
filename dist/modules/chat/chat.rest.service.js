"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const user_repo_1 = require("../user/user.repo");
const Errors_1 = require("../../utils/Errors");
const chat_repo_1 = require("./chat.repo");
const successHandler_1 = require("../../utils/successHandler");
class ChatService {
    userRepo = new user_repo_1.UserRepo();
    chatRepo = new chat_repo_1.ChatRepo();
    constructor() { }
    getChat = async (req, res, next) => {
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
        if (!chat) {
            const newChat = await this.chatRepo.create({
                data: {
                    participants: [user._id, userId],
                    createdBy: user._id,
                    message: [],
                },
            });
            return (0, successHandler_1.successHandler)({ res, result: { newChat } });
        }
        return (0, successHandler_1.successHandler)({ res, result: { chat } });
    };
}
exports.ChatService = ChatService;
