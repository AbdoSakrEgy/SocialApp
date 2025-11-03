"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepo = void 0;
const db_repo_1 = require("../../DB/repos/db.repo");
const post_model_1 = require("./post.model");
class PostRepo extends db_repo_1.DBRepo {
    model;
    constructor(model = post_model_1.PostModel) {
        super(model);
        this.model = model;
    }
}
exports.PostRepo = PostRepo;
