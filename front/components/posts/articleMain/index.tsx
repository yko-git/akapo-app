"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/api/fetchData";
import { fetchPosts } from "@/api/fetchData";
import Photo from "@/components/shared/photo";
import { useRouter } from "next/navigation";

export default function ArticleMain() {
  const [data, setData] = useState<Post[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    async function fetchData() {
      try {
        const post = await fetchPosts();
        setData(post);
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
      }
    }

    fetchData();
  }, []);

  // データが取得できていない場合の表示
  if (!data) {
    return (
      <Photo src="/home/dummyimg.png" alt="dummy" width={280} height={280} />
    );
  }

  return (
    <div className="md:my-5 md:w-[395px] md:py-6 tracking-[.2rem]">
      <div className="md:max-w-[395px] mx-auto">
        {data.length > 0 ? (
          <>
            <div>
              <Link href={`posts/${data[data.length - 1].id}`}>
                <Photo
                  src={data[data.length - 1]?.signedUrl}
                  alt={data[data.length - 1].title}
                  width={400}
                  height={542}
                />
              </Link>
            </div>
          </>
        ) : (
          <p>投稿がありません。</p>
        )}
      </div>
    </div>
  );
}
