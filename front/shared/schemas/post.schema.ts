import { z, ZodTypeAny } from "zod";
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
  imageKey: z.string(),
  status: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  urlExpiresAt: z.string(),
  userId: z.number(),
  categories: z.array(CategorySchema),
  user: UserSchema,
  commentCount: z.number().optional(),
  hasNewComment: z.boolean().optional(),
});

// 単体 Post 用
export const PostResponseSchema = z.object({
  post: PostSchema,
});

// 複数 Post 用
export const PostListResponseSchema = z.object({
  posts: z.array(PostSchema),
});

// NewPost スキーマ
export const NewPostSchema = z.object({
  title: z.string().nonempty("タイトルは必須です"),
  body: z.string().nonempty("本文は必須です"),
  status: z.string().nonempty("ステータスは必須です"),
  categoryIds: z.array(z.number()).optional(),
  imageKey: z.string().optional(),
});

// 汎用的なレスポンスデータスキーマ
export const ArticleDataSchema = <T extends ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
  });

// TypeScriptの型を自動生成
export type Category = z.infer<typeof CategorySchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type PostListResponse = z.infer<typeof PostListResponseSchema>;
export type NewPost = z.infer<typeof NewPostSchema>;
