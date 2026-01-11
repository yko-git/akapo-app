import { z } from "zod";
import { UserSchema } from "./user.schema";

// Category スキーマ
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Post スキーマ
export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  signedUrl: z.string(),
  createdAt: z.string(),
  categories: z.array(CategorySchema),
  user: UserSchema,
  imageKey: z.string(),
  commentCount: z.number(),
  hasNewComment: z.boolean().optional(),
});

// NewPost スキーマ
export const NewPostSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  body: z.string().min(1, "本文は必須です"),
  status: z.string().min(1, "ステータスは必須です"),
  categoryIds: z
    .array(z.number())
    .min(1, "カテゴリを少なくとも1つ選択してください"),
  imageKey: z.string().optional(),
});

// TypeScriptの型を自動生成
export type Category = z.infer<typeof CategorySchema>;
export type Post = z.infer<typeof PostSchema>;
export type NewPost = z.infer<typeof NewPostSchema>;
