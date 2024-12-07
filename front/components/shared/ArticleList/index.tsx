"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { fetchPost, getMockUserToken } from "../FetchData";

export default function ArticleList() {
  const [data, setData] = useState<Post[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = await getMockUserToken();
      if (!token) return;

      const post = await fetchPost(token);
      setData(post);
    }

    fetchData();
  }, []);

  // データが取得できていない場合の表示
  if (!data) {
    return <p className="text-center">読み込み中・・・</p>;
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="font-bold my-2">投稿一覧</h1>
      </div>
      <ul className="gap-2 flex flex-wrap max-w-[1024px] mx-auto">
        {data.map((item, index) => (
          <li key={index} className="border p-4 rounded">
            <div className="font-semibold">{item.title}</div>
            <div>{item.body}</div>
            <div className="mt-2">
              <Link href={`/posts/${item.id}`}>
                <img
                  src={item.signedUrl}
                  alt="Uploaded"
                  width={280}
                  height={280}
                />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
