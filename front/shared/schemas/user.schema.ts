import { z } from "zod";

// User スキーマ
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string(),
  iconSignedUrl: z.string(),
});

// NewUser スキーマ
export const NewUserSchema = z.object({
  loginId: z.string().min(1, "ログインIDは必須です"),
  name: z.string().min(1, "アカウント名は必須です"),
  password: z.string().min(1, "パスワードは1文字以上である必要があります"),
});

// NewLogin スキーマ
export const NewLoginSchema = z.object({
  loginId: z.string().min(1, "ログインIDは必須です"),
  password: z.string().min(1, "パスワードは必須です"),
});

// UserProfile スキーマ
export const UserProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  loginId: z.string(),
  iconUrl: z.string().optional(),
  signedUrl: z.string().optional(),
  iconSignedUrl: z.string(),
});

// TypeScriptの型を自動生成
export type User = z.infer<typeof UserSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;
export type NewLogin = z.infer<typeof NewLoginSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
