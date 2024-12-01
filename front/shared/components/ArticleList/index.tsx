"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PostList() {
  const [data, setData] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
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
        const res = await axios.get("http://localhost:3001/posts", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const items = res.data;
        setData(items.posts);
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const reSignedUrl = async (postId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/re-signedurl`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.signedUrl;
    } catch (error) {
      console.error("署名付きURLの再取得に失敗しました", error);
      return null;
    }
  };

  return (
    <div className="m-4">
      <h1 className="font-bold my-2">投稿一覧</h1>
      <ul className="gap-5 flex flex-wrap">
        {data.map((item, index) => (
          <li key={index} className="border p-4 rounded">
            <div className="font-semibold">{item.title}</div>
            <div>{item.body}</div>
            <div className="mt-2">
              <img
                src={item.signedUrl}
                alt="Uploaded"
                width={280}
                height={280}
                onError={async (e) => {
                  // 署名付きURLが期限切れの場合に新しいURLを取得して再設定
                  const newUrl = await reSignedUrl(item.id);
                  if (newUrl) {
                    (e.target as HTMLImageElement).src = newUrl;
                  }
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
