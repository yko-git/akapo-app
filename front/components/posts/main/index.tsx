"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/home/logo.svg";
import bnrgallery from "@/public/home/bnr-gallery.svg";
import Link from "next/link";
import ArticleMain from "@/components/posts/articleMain";
import ArticleInfo from "../articleInfo";

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
      <div className="relative">
        <div className="absolute md:bottom-60 bottom-96 -right-1 md:w-[85%] w-[95%] bg-[#6C9FE0] opacity-40 h-[21px] rounded-md inline-block -z-10"></div>
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
            <ul className="md:w-[395px] lg:mr-0 md:mr-16 mr-8 relative">
              <Link
                href="/posts/"
                className="absolute bottom-16 -right-14 md:bottom-28 md:-right-24 md:hover:-right-28 transition-all"
              >
                <Image
                  src={bnrgallery}
                  loading="lazy"
                  alt=""
                  width={179}
                  height={179}
                  className="md:min-w-[179px] max-w-[120px]"
                />
              </Link>
              <ArticleMain />
            </ul>
          </div>
          <ArticleInfo data={data} />
        </div>
      </div>
    </>
  );
}
