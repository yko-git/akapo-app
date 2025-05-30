"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/api/fetchData";
import { fetchPosts } from "@/api/fetchData";
import Photo from "@/components/shared/photo";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

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
        const posts = await fetchPosts();
        if (posts) {
          const sortedPosts = posts?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setData(sortedPosts);
        }
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
          <Swiper
            effect="fade"
            modules={[EffectFade, Autoplay]}
            speed={800}
            fadeEffect={{ crossFade: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {data.map((value) => {
              return (
                <SwiperSlide key={value.id}>
                  <Link href={`posts/${value.id}`}>
                    <Photo
                      src={value?.signedUrl}
                      alt={value.title}
                      width={400}
                      height={542}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p>投稿がありません。</p>
        )}
      </div>
    </div>
  );
}
