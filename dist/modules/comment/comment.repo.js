"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepo = void 0;
const comment_model_1 = require("./comment.model");
const db_repo_1 = require("../../DB/repos/db.repo");
class CommentRepo extends db_repo_1.DBRepo {
    model;
    constructor(model = comment_model_1.CommentModel) {
        super(model);
        this.model = model;
    }
}
exports.CommentRepo = CommentRepo;
