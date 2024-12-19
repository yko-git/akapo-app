"use client";
import Link from "next/link";
import Photo from "@/components/shared/photo";
import { UserArticleListProps } from "@/types";

export default function UserArticleList({ data }: UserArticleListProps) {
  if (!data) {
    return <p>投稿がありません。</p>;
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="font-bold my-2">ユーザー投稿一覧</h1>
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
            <div className="font-semibold mt-3">{item.title}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
