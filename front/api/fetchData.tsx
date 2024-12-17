import axios from "axios";
import { Post, NewPost } from "@/types";

// axiosインスタンス
const instance = axios.create({
  baseURL: "http://localhost:3001/",
});

// トークン取得関数
export async function getMockUserToken(): Promise<string | null> {
  try {
    const response = await instance.post("mockurl");
    const { token } = response.data;
    return token;
  } catch (error) {
    console.error("モックユーザーのトークン取得に失敗しました", error);
    return null;
  }
}

// 個別投稿データ取得関数
export async function fetchPost({
  id,
  token,
}: {
  id?: number; // オプショナルにする
  token: string;
}): Promise<Post | null> {
  try {
    const response = await instance.get(`posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.posts;
  } catch (error) {
    console.error("投稿の取得に失敗しました", error);
    return null;
  }
}

// 複数投稿データ取得関数
export async function fetchPosts({
  token,
}: {
  token: string;
}): Promise<Post[] | null> {
  try {
    const response = await instance.get(`posts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
      headers: {
        Authorization: `Bearer ${token}`, // モックユーザーのトークンを指定
      },
    });
    const { signedUrl, safeFilePath } = signedUrlResponse.data;

    // S3に画像をアップロード
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // 記事情報をサーバーに送信
    const postResponse = await instance.post(
      "posts",
      {
        post: {
          title,
          body,
          status,
          categoryIds,
          imageKey: safeFilePath, // 画像のキーを指定
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("記事が投稿されました！");
    console.log("Post created:", postResponse.data.post);

    return postResponse.data.post.signedUrl; // サーバーからの署名付きURLを使用
  } catch (error) {
    console.error("投稿中にエラーが発生しました", error);
  }
}
