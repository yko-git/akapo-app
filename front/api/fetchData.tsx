import axios from "axios";
require("dotenv").config();

export interface User {
  id: number;
  name: string;
  iconUrl: string;
  iconSignedUrl: string;
}

export interface NewUser {
  loginId: string;
  name: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  loginId: string;
  iconUrl?: string;
  signedUrl?: string;
  iconSignedUrl: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  signedUrl: string;
  createdAt: string;
  categories: { id: number; name: string }[];
  user: User;
  imageKey: string;
  commentCount: number;
}

export interface NewPost {
  title: string;
  body: string;
  status: string;
  categoryIds: number[];
  imageKey?: string;
}

export interface NewComment {
  body: string;
}

export interface TagListProps {
  Categories?: Array<{ name: string }>;
}

interface NewLogin {
  loginId: string;
  password: string;
}

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    iconSignedUrl: string;
    id: number;
  };
};

export type ArticleData = {
  data: Post[];
};

export type Category = {
  id: number;
};

// axiosインスタンス
const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
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
  }
);

// 個別投稿データ取得関数
export async function fetchPost({
  id,
}: {
  id?: number; // オプショナルにする
}): Promise<Post | null> {
  const response = await instance.get(`posts/${id}`);
  return response.data.posts;
}

// 複数投稿データ取得関数
export async function fetchPosts(): Promise<Post[] | null> {
  const response = await instance.get(`posts/`);
  return response.data.posts;
}

// 記事投稿関数
export async function createPost(
  file: File,
  postData: NewPost
): Promise<string | undefined> {
  const { title, body, status, categoryIds } = postData;
  // S3の署名付きURLを取得
  const signedUrlResponse = await instance.get("signedurl", {
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
      title,
      body,
      status,
      categoryIds,
      imageKey: safeFilePath, // 画像のキーを指定
    },
  });

  return postResponse.data.post.signedUrl; // サーバーからの署名付きURLを使用
}

// 新規ユーザー登録
export async function createUser(
  file: File,
  userData: NewUser
): Promise<string | undefined> {
  const { loginId, name, password } = userData;
  // S3の署名付きURLを取得
  const signedUrlResponse = await instance.get("signedurl", {
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
  const userResponse = await instance.post("auth/signup", {
    user: {
      loginId,
      name,
      password,
      iconUrl: safeFilePath, // 画像のキーを指定
    },
  });

  return userResponse.data.user.iconSignedUrl; // サーバーからの署名付きURLを使用
}

// 新規ログイン用関数
export async function createLogin(
  postData: NewLogin
): Promise<string | undefined> {
  const response = await instance.post("auth/login", postData);
  const { token } = response.data;
  // トークンをlocalStorageに保存
  localStorage.setItem("token", token);
  return token;
}

// ユーザー投稿データ取得関数
export async function fetchUserPosts(): Promise<Post[] | null> {
  const response = await instance.get(`user/posts`);
  return response.data.posts;
}

// ユーザー情報取得関数
export async function fetchUserData(): Promise<UserProfile | null> {
  const response = await instance.get(`user`);
  return response.data.user;
}

// 個別投稿データ削除関数
export async function deletePost({ id }: { id: number }): Promise<void> {
  return await instance.delete(`posts/${id}`);
}

// 記事編集関数
export async function patchPost(id: number, postData: NewPost) {
  const { title, body, status, categoryIds } = postData;
  // 記事情報をサーバーに送信
  const postResponse = await instance.patch(`posts/${id}`, {
    post: postData,
  });

  return postResponse.data.post.signedUrl; // サーバーからの署名付きURLを使用
}

// 記事編集関数（画像）
export async function uploadImage(file: File) {
  const signedUrlResponse = await instance.get("signedurl", {
    params: { filename: file.name },
  });
  const { signedUrl, safeFilePath } = signedUrlResponse.data;

  if (file && file.name) {
    await axios.put(signedUrl, file, {
      headers: { "Content-Type": file.type },
    });

    return { signedUrl, safeFilePath };
  }
}

// コメントデータ取得関数
export async function fetchComments({
  postId,
}: {
  postId: number;
}): Promise<Comment[]> {
  const response = await instance.get(`posts/${postId}/comments`);
  return response.data.comments;
}

// コメント投稿関数
export async function createComment(
  postId: number,
  postData: NewComment
): Promise<Comment> {
  const response = await instance.post(`posts/${postId}/comments`, postData);
  return response.data.comment;
}

// コメントデータ削除関数
export async function deleteComments({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}): Promise<void> {
  return await instance.delete(`posts/${postId}/comments/${commentId}`);
}
