"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { fetchPosts } from "@/api/fetchData";
import Photo from "@/components/shared/photo";
import Image from "next/image";
import TagList from "@/components/shared/tagList";

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
      <ul className="gap-10 flex flex-wrap max-w-[1280px] mx-auto mt-10">
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
            <ul className="mt-4">
              <TagList Categories={item.Categories} />
            </ul>
            <div className="font-semibold mt-4">{item.title}</div>
            <div className="flex items-center justify-between mt-2 text-[#807f7f]">
              <div className="flex items-center">
                <Image
                  className="inline-block mr-2 rounded-full object-cover w-[31px] h-[31px] "
                  src={item.User.iconSignedUrl}
                  alt=""
                  width={31}
                  height={31}
                  loading="lazy"
                />
                <p className="text-sm">{item.User.name}</p>
              </div>
              <p className="text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
