"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PostList() {
  const [data, setData] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // モックユーザーのJWTトークンを取得
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

  return (
    <div className="m-4">
      <h1 className="font-bold my-2">投稿一覧</h1>
      <ul className="gap-2 flex">
        {data.map((item, index) => (
          <li key={index}>
            <div>{item.title}</div>
            <div>{item.body}</div>
            <div>
              <img
                src={`https://images.akapo-app.com/${item.imageKey}`}
                alt="Uploaded"
                width={150}
                height={150}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
