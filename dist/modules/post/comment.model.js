"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "post", required: true },
    commenter: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    mentions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
    parentCommentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "comment",
        default: null,
    },
    // Date.now => you are passing the function reference — not calling it yet
    // Date.now() => you are calling the function immediately, right when the schema is defined
    // Date.now => return number, but mongoosy automatically converts it to a Date since the field type is Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.CommentModel = (0, mongoose_1.model)("comment", commentSchema);
