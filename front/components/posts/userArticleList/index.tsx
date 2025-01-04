"use client";
import Link from "next/link";
import PhotoList from "@/components/shared/photoList";
import { Post } from "@/api/fetchData";

interface UserArticleListProps {
  data: Post[] | null;
}

export default function UserArticleList({ data }: UserArticleListProps) {
  if (!data) {
    return <p>投稿がありません。</p>;
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="font-bold my-2">ユーザー投稿一覧</h1>
        <p>{data.length} 件</p>
      </div>
      <ul className="gap-5 flex flex-wrap max-w-[1024px] mx-auto">
        {data ? (
          data.map((item, index) => (
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
              <div className="font-semibold mt-3">{item.title}</div>
            </li>
          ))
        ) : (
          <p>投稿を読み込んでいます...</p>
        )}
      </ul>
    </>
  );
}
