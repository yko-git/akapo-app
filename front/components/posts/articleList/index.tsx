"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { fetchPosts } from "@/api/fetchData";
import Photo from "@/components/shared/photo";

export default function ArticleList() {
  const [data, setData] = useState<Post[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const posts = await fetchPosts();
      setData(posts);
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
      <ul className="gap-5 flex flex-wrap max-w-[1024px] mx-auto">
        {data.map((item, index) => (
          <li key={index}>
            <div className="mt-4">
              <Link href={`/posts/${item.id}`}>
                <Photo
                  src={item.signedUrl}
                  alt={item.title}
                  width={280}
                  height={280}
                />
              </Link>
            </div>
            <div className="text-sm mt-3">{item.User.name}</div>
            <div className="font-semibold mt-2">{item.title}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
