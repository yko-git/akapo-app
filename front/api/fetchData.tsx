import axios from "axios";
import { Post, NewPost, NewUser, NewLogin } from "@/types";

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
  try {
    const response = await instance.get(`posts/${id}`);
    console.log(response.data.posts);
    return response.data.posts;
  } catch (error) {
    console.error("投稿の取得に失敗しました", error);
    return null;
  }
}

// 複数投稿データ取得関数
export async function fetchPosts(): Promise<Post[] | null> {
  try {
    const response = await instance.get(`posts/`);

    return response.data.posts;
  } catch (error) {
    console.error("投稿の取得に失敗しました", error);
    return null;
  }
}

// 記事投稿関数
export async function createPost(
  file: File,
  token: string,
  postData: NewPost
): Promise<string | undefined> {
  const { title, body, status, categoryIds } = postData;
  try {
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

    alert("記事が投稿されました！");
    console.log("Post created:", postResponse.data.post);

    return postResponse.data.post.signedUrl; // サーバーからの署名付きURLを使用
  } catch (error) {
    console.error("投稿中にエラーが発生しました", error);
  }
}

// 新規ユーザー登録
export async function createUser(
  file: File,
  userData: NewUser
): Promise<string | undefined> {
  const { loginId, name, password } = userData;
  try {
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
    console.log("User created:", userResponse.data.user);

    return userResponse.data.user.signedUrl; // サーバーからの署名付きURLを使用
  } catch (error) {
    console.error("登録中にエラーが発生しました", error);
  }
}

// 新規ログイン用関数
export async function createLogin(
  postData: NewLogin
): Promise<string | undefined> {
  try {
    const response = await instance.post("auth/login", postData);
    const { token } = response.data;
    // トークンをlocalStorageに保存
    localStorage.setItem("token", token);
    return token;
  } catch (error) {
    console.error("ログインに失敗しました", error);
  }
}

// ユーザー情報取得関数
export async function user(): Promise<any | null> {
  try {
    const response = await instance.get("user");

    console.log("user():", response.data);
    return response.data;
  } catch (error) {
    console.error("ログインに失敗しました", error);
    return null;
  }
}

// ユーザー用トークン取得関数
export async function getUserToken(): Promise<any | null> {
  try {
    const token = localStorage.getItem("token");
    console.log(`localStorage:${token}`);
    return token;
  } catch (error) {
    console.error("ログインに失敗しました", error);
    return null;
  }
}

// ユーザー投稿データ取得関数
export async function fetchUserPosts(): Promise<Post[] | null> {
  try {
    const response = await instance.get(`user/posts`);

    console.log(`fetchUserPosts:${response.data.posts}`);
    return response.data.posts;
  } catch (error) {
    console.error("投稿の取得に失敗しました", error);
    return null;
  }
}
