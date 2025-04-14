"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/api/fetchData";
import { fetchPosts } from "@/api/fetchData";
import PhotoList from "@/components/shared/photoList";
import Image from "next/image";
import TagList from "@/components/shared/tagList";
import { useRouter } from "next/navigation";

export default function ArticleList() {
  const [data, setData] = useState<Post[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    async function fetchData() {
      try {
        const posts = await fetchPosts();
        setData(posts);
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
      }
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
      <ul className="gap-10 md:flex flex-wrap max-w-[1280px] mx-auto mt-10">
        {data.map((item, index) => (
          <li key={index}>
            <div className="mt-4">
              <Link href={`/posts/${item.id}`}>
                <PhotoList
                  src={item.signedUrl}
                  alt={item.title}
                  width={280}
                  height={280}
                />
              </Link>
            </div>
            <ul className="mt-4">
              <TagList Categories={item.categories} />
            </ul>
            <div className="font-semibold mt-4">{item.title}</div>
            <div className="flex items-center justify-between mt-2 text-[#807f7f]">
              <div className="flex items-center">
                <Image
                  className="inline-block mr-2 rounded-full object-cover w-[31px] h-[31px] "
                  src={item.user.iconSignedUrl}
                  alt=""
                  width={31}
                  height={31}
                  loading="lazy"
                />
                <p className="text-sm">{item.user.name}</p>
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
