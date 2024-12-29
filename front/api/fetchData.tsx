import axios from "axios";

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
}

export interface Post {
  id: number;
  title: string;
  body: string;
  signedUrl: string;
  createdAt: string;
  categories: { id: number; name: string }[];
  user: User;
}

export interface NewPost {
  title: string;
  body: string;
  status: string;
  categoryIds: number[];
}

export interface TagListProps {
  Categories?: Array<{ name: string }>;
}

interface NewLogin {
  loginId: string;
  password: string;
}

// axiosインスタンス
const instance = axios.create({
  baseURL: "http://localhost:3001/",
});

// トークンの設定
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  const signedUrlResponse = await instance.get("postsimage", {
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
  const signedUrlResponse = await instance.get("postsimage", {
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

  return userResponse.data.user.signedUrl; // サーバーからの署名付きURLを使用
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
