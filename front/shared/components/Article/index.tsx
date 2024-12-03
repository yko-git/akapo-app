"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  signedUrl: string;
  createdAt: string;
  Categories: { id: number; name: string }[];
}

export default function ArticleMain({ id }: { id: number }) {
  const [data, setData] = useState<Post | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // トークンの取得
        const getMockUserToken = async () => {
          try {
            const response = await axios.post("http://localhost:3001/mockurl");
            const { token } = response.data;
            setToken(token);
            return token;
          } catch (error) {
            console.error("モックユーザーのトークン取得に失敗しました", error);
            return null;
          }
        };

        const userToken = await getMockUserToken();
        if (!userToken) return;

        // 投稿データの取得
        const res = await axios.get(`http://localhost:3001/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        console.log(res.data.post);
        setData(res.data.post); // サーバーからのデータ構造に合わせる
      } catch (error) {
        console.error("投稿の取得に失敗しました", error);
      }
    }

    fetchData();
  }, [id]);

  const reSignedUrl = async () => {
    try {
      if (!data || !token) return;

      const response = await axios.post(
        `http://localhost:3001/posts/${data.id}/re-signedurl`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 新しいURLを設定
      setData((prevData) =>
        prevData ? { ...prevData, signedUrl: response.data.signedUrl } : null
      );
    } catch (error) {
      console.error("署名付きURLの再取得に失敗しました", error);
    }
  };

  // データが取得できていない場合の表示
  if (!data) {
    return <p>読み込み中・・・</p>;
  }

  return (
    <>
      <h1 className="font-bold my-2">{data.title}</h1>
      <div>{new Date(data.createdAt).toLocaleString()}</div>
      <div>{data.Categories.map((value: any) => value.name).join(", ")}</div>
      <div className="mt-4">
        <img
          src={data.signedUrl}
          alt={data.title}
          width={400}
          height={300}
          onError={() => reSignedUrl()} // URL期限切れ時の処理
        />
      </div>
      <div>{data.body}</div>
    </>
  );
}
