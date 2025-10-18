"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChildCommentIdsIterative = void 0;
const getAllChildCommentIdsIterative = async (parentId, commentModel) => {
    const allIds = [parentId];
    const queue = [parentId];
    while (queue.length > 0) {
        const currentParentId = queue.shift();
        // Fetch all direct children
        const children = await commentModel
            .find({ parentCommentId: currentParentId }, { _id: 1 })
            .lean();
        for (const child of children) {
            allIds.push(child._id);
            queue.push(child._id);
        }
    }
    return allIds;
};
exports.getAllChildCommentIdsIterative = getAllChildCommentIdsIterative;
