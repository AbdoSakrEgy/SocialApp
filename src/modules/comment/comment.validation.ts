import z from "zod";

export const addCommentSchema = z.object({
  postId: z.string(),
  parentCommentId: z.string().optional(),
  commentContent: z.string(),
  mentions: z.array(z.string()).optional(),
});

export const updateCommentSchema = z
  .object({
    postId: z.string(),
    commentId: z.string(),
    newCommentContent: z.string().optional(),
    newMentions: z.array(z.object()).optional(),
  })
  .superRefine((args, ctx) => {
    if (!args.newCommentContent && !args.newMentions) {
      ctx.addIssue({
        code: "custom",
        path: ["newCommentContent", "newMentions"],
        message:
          "Either newCommentContent or newMentions are required to update comment",
      });
    }
  });

export const deleteCommentSchema = z.object({
  postId: z.string(),
  commentId: z.string(),
});

export const getCommentSchema = z.object({
  postId: z.string(),
  commentId: z.string(),
  withChildComments: z.boolean().optional(),
});
