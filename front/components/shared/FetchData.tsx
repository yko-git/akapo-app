import axios from "axios";
import { Post } from "@/types";

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
