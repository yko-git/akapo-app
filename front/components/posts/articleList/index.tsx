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
  const [status, setStatus] = useState<"loading" | "service-down" | "success">(
    "loading"
  );
  const [data, setData] = useState<Post[] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    async function fetchData() {
      try {
        const posts = await fetchPosts();
        const sortedPosts = posts?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setData(sortedPosts);
        setStatus("success");
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
        setStatus("service-down");
      }
    }
    fetchData();
  }, []);

  // データが取得できていない場合の表示
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white my-20">
          <p className="text-gray-800 text-lg font-medium mb-2">
            読み込み中です…
          </p>
          <p className="text-gray-600 mb-4">しばらくお待ちください。</p>
        </div>
      </div>
    );
  }
  if (!data || status === "service-down") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white my-20">
          <p className="text-gray-800 text-lg font-medium mb-2">
            現在、サービスは一時停止中です。
          </p>
          <p className="text-gray-600 mb-4">
            午前9時から午後7時の間にアクセスしてください。
          </p>
          <hr className="my-4" />
          <p className="text-gray-600">
            Please access between 9:00 AM and 7:00 PM.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="font-bold my-2">投稿一覧</h1>
      </div>
      <ul className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-20 gap-x-5 max-w-[1400px] mx-auto mt-10 px-5">
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
