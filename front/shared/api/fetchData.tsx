import axios from "axios";
import {
  NewUser,
  NewLogin,
  UserProfile,
  UserProfileSchema,
  Post,
  NewPost,
  PostSchema,
  NewPostSchema,
  PostResponseSchema,
  PostListResponseSchema,
  Comment,
  CommentSchema,
  NewComment,
} from "@/shared/schemas";
import z from "zod";
import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT } from "@/config/api";
require("dotenv").config();

// axiosインスタンス
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

// トークンの設定
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスで401を検出したらログイン画面へリダイレクト
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // トークンをクリア
      window.location.href = "/login"; // ログイン画面へ遷移
    }
    return Promise.reject(error);
  },
);

// 個別投稿データ取得関数
export async function fetchPost({ id }: { id: number }) {
  const res = await instance.get(API_ENDPOINTS.POSTS + `/${id}`);

  // レスポンスデータのバリデーション
  const parsed = PostResponseSchema.safeParse(res.data);
  if (!parsed.success) {
    console.error("post parse error", parsed.error);
    return null;
  }

  return parsed.data.post;
}
// 複数投稿データ取得関数
export async function fetchPosts(): Promise<Post[]> {
  const res = await instance.get(API_ENDPOINTS.POSTS);

  // レスポンスデータのバリデーション
  const parsed = PostListResponseSchema.parse(res.data);
  return parsed.posts;
}

// 記事投稿関数
export async function createPost(
  file: File,
  postData: NewPost,
): Promise<string> {
  // バリデーション
  const validation = NewPostSchema.safeParse(postData);
  if (!validation.success) {
    throw new Error("Invalid post data");
  }
  // S3の署名付きURLを取得
  const signedUrlResponse = await instance.get(API_ENDPOINTS.SIGNEDURL, {
    params: { filename: file.name },
  });
  const { signedUrl, safeFilePath } = signedUrlResponse.data;

  // S3に画像をアップロード
  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // 記事情報をサーバーに送信
  const postResponse = await instance.post("posts", {
    post: {
      ...validation.data,
      imageKey: safeFilePath, // 画像のキーを指定
    },
  });

  return postResponse.data.post.signedUrl;
}

// 新規ユーザー登録
export async function createUser(
  file: File,
  userData: NewUser,
): Promise<string> {
  const { loginId, name, password } = userData;
  // S3の署名付きURLを取得
  const signedUrlResponse = await instance.get(API_ENDPOINTS.SIGNEDURL, {
    params: { filename: file.name },
  });
  const { signedUrl, safeFilePath } = signedUrlResponse.data;

  // S3に画像をアップロード
  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // ユーザー情報をサーバーに送信
  const userResponse = await instance.post(API_ENDPOINTS.SIGNUP, {
    user: {
      loginId,
      name,
      password,
      iconUrl: safeFilePath, // 画像のキーを指定
    },
  });

  // レスポンスデータのバリデーション
  const result = UserProfileSchema.safeParse(userResponse.data.user);
  if (!result.success) {
    console.error("データの形式が正しくありません:", result.error);
    throw new Error("Invalid response data");
  }

  return result.data.iconSignedUrl; // サーバーからの署名付きURLを使用
}

// 新規ログイン用関数
export async function createLogin(postData: NewLogin): Promise<string> {
  const response = await instance.post(API_ENDPOINTS.LOGIN, postData);

  // レスポンスデータのバリデーション
  if (!response.data.token) {
    throw new Error("Token not received");
  }
  const { token } = response.data;
  // トークンをlocalStorageに保存
  localStorage.setItem("token", token);
  return token;
}

// ユーザー投稿データ取得関数
export async function fetchUserPosts(): Promise<Post[] | null> {
  const response = await instance.get(API_ENDPOINTS.USERPOSTS);

  // レスポンスデータのバリデーション
  const result = z.array(PostSchema).safeParse(response.data.posts);
  if (!result.success) {
    console.error("データの形式が正しくありません:", result.error);
    return null;
  }
  return result.data;
}

// ユーザー情報取得関数
export async function fetchUserData(): Promise<UserProfile | null> {
  const response = await instance.get(API_ENDPOINTS.USER);

  // レスポンスデータのバリデーション
  const result = UserProfileSchema.safeParse(response.data.user);
  if (!result.success) {
    console.error("ユーザーデータが不正です:", result.error);
    return null;
  }
  return result.data;
}

// 個別投稿データ削除関数
export async function deletePost({ id }: { id: number }): Promise<void> {
  return await instance.delete(API_ENDPOINTS.POSTS + `/${id}`);
}

// 記事編集関数
export async function patchPost(
  id: number,
  postData: NewPost,
): Promise<string> {
  const validation = NewPostSchema.safeParse(postData);
  if (!validation.success) {
    throw new Error("Invalid post data");
  }

  const postResponse = await instance.patch(API_ENDPOINTS.POSTS + `/${id}`, {
    post: validation.data,
  });

  return postResponse.data.post.signedUrl;
}

// 記事編集関数（画像）
export async function uploadImage(
  file: File,
): Promise<{ signedUrl: string; safeFilePath: string }> {
  const signedUrlResponse = await instance.get("signedurl", {
    params: { filename: file.name },
  });
  const { signedUrl, safeFilePath } = signedUrlResponse.data;

  await axios.put(signedUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return { signedUrl, safeFilePath };
}

// コメントデータ取得関数
export async function fetchComments({
  postId,
}: {
  postId: number;
}): Promise<Comment[]> {
  const response = await instance.get(
    API_ENDPOINTS.POSTS + `/${postId}/comments`,
  );

  // レスポンスデータのバリデーション
  const result = z.array(CommentSchema).safeParse(response.data.comments);
  if (!result.success) {
    console.error("コメントデータが不正です:", result.error);
    return []; // 空配列を返す
  }
  return result.data;
}

// コメント投稿関数
export async function createComment(
  postId: number,
  postData: NewComment,
): Promise<Comment> {
  const response = await instance.post(
    API_ENDPOINTS.POSTS + `/${postId}/comments`,
    postData,
  );

  // レスポンスデータのバリデーション
  const result = CommentSchema.safeParse(response.data.comment);
  if (!result.success) {
    console.error("データの形式が正しくありません:", result.error);
    throw new Error("Invalid comment data");
  }
  return result.data;
}

// コメントデータ削除関数
export async function deleteComments({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}): Promise<void> {
  return await instance.delete(
    API_ENDPOINTS.POSTS + `/${postId}/comments/${commentId}`,
  );
}
