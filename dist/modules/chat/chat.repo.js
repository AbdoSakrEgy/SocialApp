"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepo = void 0;
const db_repo_1 = require("../../DB/repos/db.repo");
const chat_model_1 = require("./chat.model");
class ChatRepo extends db_repo_1.DBRepo {
    model;
    constructor(model = chat_model_1.ChatModel) {
        super(model);
        this.model = model;
    }
}
exports.ChatRepo = ChatRepo;
