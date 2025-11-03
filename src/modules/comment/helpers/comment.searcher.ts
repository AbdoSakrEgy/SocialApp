import { Types } from "mongoose";
import { CommentModel, IComment } from "../comment.model";

// ============================ getAllChildCommentIds ============================
export async function getAllChildCommentIds(rootId: string, commentModel: any) {
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
export async function getAllChildComments(
  rootId: string | Types.ObjectId,
  commentModel: typeof CommentModel,
  includeRoot = false
): Promise<IComment[]> {
  const allComments: IComment[] = [];
  const queue: (string | Types.ObjectId)[] = [rootId];

  // Optional: include the root comment itself
  if (includeRoot) {
    const root = await commentModel.findById(rootId).lean();
    if (root) allComments.push(root as IComment);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    const children = await commentModel
      .find({ parentCommentId: current })
      .lean();

    // Add each child to results and continue traversal
    for (const child of children) {
      allComments.push(child as IComment);
      queue.push(child._id.toString());
    }
  }

  return allComments;
}
