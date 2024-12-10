import axios from "axios";
import { Post, NewPost } from "@/types";

// トークン取得関数
export async function getMockUserToken(): Promise<string | null> {
  try {
    const response = await axios.post("http://localhost:3001/mockurl");
    const { token } = response.data;
    return token;
  } catch (error) {
    console.error("モックユーザーのトークン取得に失敗しました", error);
    return null;
  }
}

// 投稿データ取得関数（個別）
export async function fetchPostById(
  id: number,
  token: string
): Promise<Post | null> {
  try {
    const response = await axios.get(`http://localhost:3001/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.post;
  } catch (error) {
    console.error("投稿の取得に失敗しました", error);
    return null;
  }
}

// 投稿データ取得関数（リスト）
export async function fetchPost(token: string): Promise<Post[]> {
  try {
    const response = await axios.get(`http://localhost:3001/posts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const posts = Array.isArray(response.data.posts)
      ? response.data.posts
      : [response.data.posts];
    return posts; // 配列形式で返す
  } catch (error) {
    console.error("投稿の取得に失敗しました", error);
    return [];
  }
}

// 記事投稿関数
export async function PostImg(
  file: File,
  token: any,
  postData: NewPost
): Promise<string | undefined> {
  const { title, body, status, categoryIds } = postData;
  try {
    // S3の署名付きURLを取得
    const signedUrlResponse = await axios.get(
      "http://localhost:3001/postsimage",
      {
        params: { filename: file.name },
        headers: {
          Authorization: `Bearer ${token}`, // モックユーザーのトークンを指定
        },
      }
    );
    const { signedUrl, safeFilePath } = signedUrlResponse.data;

    // S3に画像をアップロード
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // 記事情報をサーバーに送信
    const postResponse = await axios.post(
      "http://localhost:3001/posts/new",
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
