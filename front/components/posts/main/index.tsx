"use client";
import { useEffect, useState } from "react";
import { jost } from "@/components/shared/font";
import ArticleList from "@/components/posts/articleList";
import { Post } from "@/schemas/post.schema";
import { fetchPosts } from "@/api/fetchData";
import StatusInfo from "@/components/shared/statusInfo";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function Main() {
  const [status, setStatus] = useState<"loading" | "service-down" | "success">(
    "loading"
  );
  const [data, setData] = useState<Post[] | undefined>(undefined);
  const isAuthChecked = useRequireAuth();
  useEffect(() => {
    if (!isAuthChecked) return; // 認証チェックが完了していない場合はデータ取得をスキップ

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
  }, [isAuthChecked]);

  // データが取得できていない場合の表示
  if (status !== "success" || data === undefined) {
    return <StatusInfo status={status} data={data} />;
  }
  return (
    <>
      <div className="text-center md:mb-0 mb-5">
        <h3
          className={`${jost.className} md:text-[53px] text-[22px] text-[#6C9FE0] tracking-[.2rem] font-bold`}
        >
          Gallery
        </h3>
      </div>
      <ArticleList />
    </>
  );
}
