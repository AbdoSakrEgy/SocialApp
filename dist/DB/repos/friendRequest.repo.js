"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestRepo = void 0;
const db_repo_1 = require("./db.repo");
const friendRequest_model_1 = require("../models/friendRequest.model");
class FriendRequestRepo extends db_repo_1.DBRepo {
    model;
    constructor(model = friendRequest_model_1.FriendRequestModel) {
        super(model);
        this.model = model;
    }
}
exports.FriendRequestRepo = FriendRequestRepo;
