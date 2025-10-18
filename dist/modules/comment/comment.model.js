"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "post", required: true },
    parentCommentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "comment",
        default: null,
    },
    commenterId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    commentContent: { type: String, required: true },
    mentions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.CommentModel = (0, mongoose_1.model)("comment", commentSchema);
