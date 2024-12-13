"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { getMockUserToken, fetchPost } from "@/api/fetchData";
import Image from "next/image";

export default function ArticleMain() {
  const [data, setData] = useState<Post[]>([]);

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
    <div className="md:my-5 md:w-[395px] md:py-6 tracking-[.2rem]">
      <div className="md:max-w-[395px] mx-auto">
        <div className="relative">
          {data.length > 0 ? (
            <>
              <div>
                <Link href={`posts/${data[data.length - 1].id}`}>
                  <Image
                    src={data[data.length - 1]?.signedUrl}
                    alt="Uploaded"
                    width={395}
                    height={500}
                  />
                </Link>
              </div>
              <div className="absolute bottom-1 right-1">
                {data[data.length - 1].title}
              </div>
            </>
          ) : (
            <p>投稿がありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
