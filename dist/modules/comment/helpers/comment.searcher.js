"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChildCommentIds = getAllChildCommentIds;
exports.getAllChildComments = getAllChildComments;
// ============================ getAllChildCommentIds ============================
async function getAllChildCommentIds(rootId, commentModel) {
    const allIds = [rootId];
    const queue = [rootId];
    while (queue.length > 0) {
        const current = queue.shift();
        const children = await commentModel
            .find({ parentCommentId: current })
            .select("_id")
            .lean();
        for (const child of children) {
            allIds.push(child._id);
            queue.push(child._id);
        }
    }
    return allIds.slice(1); // exclude root if you want only children
    // return allIds;
}
// ============================ getAllChildComments ============================
async function getAllChildComments(rootId, commentModel, includeRoot = false) {
    const allComments = [];
    const queue = [rootId];
    // Optional: include the root comment itself
    if (includeRoot) {
        const root = await commentModel.findById(rootId).lean();
        if (root)
            allComments.push(root);
    }
    while (queue.length > 0) {
        const current = queue.shift();
        const children = await commentModel
            .find({ parentCommentId: current })
            .lean();
        // Add each child to results and continue traversal
        for (const child of children) {
            allComments.push(child);
            queue.push(child._id.toString());
        }
    }
    return allComments;
}
