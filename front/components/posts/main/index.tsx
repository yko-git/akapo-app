"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/home/logo.svg";
import ArticleMain from "@/components/posts/articleMain";
import { jost } from "@/components/shared/font";
import ArticleList from "@/components/posts/articleList";
import { Post } from "@/api/fetchData";
import { fetchPosts } from "@/api/fetchData";
import StatusInfo from "@/components/shared/statusInfo";

export default function Main() {
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
  if (status !== "success" || data === undefined) {
    return <StatusInfo status={status} data={data} />;
  }
  return (
    <>
      <div className="text-center">
        <h3
          className={`${jost.className} md:text-[53px] text-[22px] text-[#6C9FE0] tracking-[.2rem] font-bold`}
        >
          Gallery
        </h3>
      </div>
      {/* <div className="bg-[#F5F8FD] mt-8">
        <div className="wrapper">
          <div className="lg:w-[850px] mx-auto flex justify-between items-center flex-col-reverse md:flex-row">
            <h2>
              <Image
                src={logo}
                loading="lazy"
                alt="こどもの成長と思い出を、作品とともに記録するサイト"
                width={369}
                height={359}
                className="md:min-w-[369px] mx-auto md:mt-0 mt-5 md:p-0 p-5"
              />
            </h2>
            <ul className="md:w-[395px] relative">
              <ArticleMain />
            </ul>
          </div>
        </div>
      </div>
      <div className="wrapper md:mt-20">
        <h1 className="font-bold md:my-2 md:text-3xl text-xl">作品一覧</h1>
      </div> */}
      <ArticleList />
    </>
  );
}
