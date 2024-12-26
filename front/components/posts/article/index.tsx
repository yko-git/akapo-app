"use client";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import { fetchPost } from "@/api/fetchData";
import Image from "next/image";
import TagList from "@/components/shared/tagList";
import Photo from "@/components/shared/photo";

export default function Article({ id }: { id: number }) {
  const [data, setData] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const post = await fetchPost({ id });
        if (Array.isArray(post) && post.length > 0) {
          setData(post[0]);
        }
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
      }
    }

    fetchData();
  }, [id]);

  // データが取得できていない場合の表示
  if (!data) {
    return <p className="text-center">読み込み中・・・</p>;
  }

  return (
    <>
      <div className="md:mt-12">
        <div className="md:flex justify-between">
          <Photo
            src={data.signedUrl}
            alt={data.title}
            width={400}
            height={542}
          />

          <div className="md:w-full md:pl-10 tracking-[.2em] md:mt-0 mt-10 relative">
            <div className="mt-4">
              <div className="inline-block text-center md:absolute right-0 top-0">
                {data ? (
                  <>
                    <div className="inline-block text-center">
                      <Image
                        className="inline-block mr-2 rounded-full object-cover w-[90px] h-[90px] border-[#6C9FE0] border-4"
                        src={data.user.iconSignedUrl}
                        alt=""
                        width={90}
                        height={90}
                        loading="lazy"
                      />
                      <p className="text-[12px] mt-1">{data.user.name}</p>
                    </div>
                  </>
                ) : (
                  <p>ユーザー情報を読み込んでいます...</p>
                )}
              </div>
            </div>
            <p className="text-[#9F9F9F] text-[12px] mt-4 ">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
            {/* category */}
            <ul className="mt-2">
              <TagList Categories={data.categories} />
            </ul>
            <div className="mt-4 md:text-[27px] text-lg leading-9 font-bold">
              {data.title}
            </div>
            <div className="mt-4 leading-8 text-slate-500">
              {data.body.split("\n").map((item: string, index: number) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
