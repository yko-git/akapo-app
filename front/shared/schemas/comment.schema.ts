import z from "zod";
import { UserSchema } from "./user.schema";

// Comment スキーマ
export const CommentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  userId: z.number(),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: UserSchema,
});

// NewComment スキーマ
export const NewCommentSchema = z.object({
  body: z.string().min(1, "コメントは必須です"),
});

// TypeScriptの型を自動生成
export type Comment = z.infer<typeof CommentSchema>;
export type NewComment = z.infer<typeof NewCommentSchema>;
