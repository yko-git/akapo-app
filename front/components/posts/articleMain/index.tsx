"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/api/fetchData";
import { fetchPosts } from "@/api/fetchData";
import Photo from "@/components/shared/photo";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { useRequireAuth } from "@/hooks/useRequireAuth";

import "swiper/css";
import "swiper/css/effect-fade";

export default function ArticleMain() {
  const [data, setData] = useState<Post[] | null>(null);
  const isAuthChecked = useRequireAuth();

  useEffect(() => {
    if (!isAuthChecked) return; // 認証チェックが完了していない場合はデータ取得をスキップ

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
  }, [isAuthChecked]);

  // データが取得できていない場合の表示
  if (!data) {
    return <Photo src="/home/dummyimg.png" alt="dummy" />;
  }

  return (
    <div className="md:my-5 md:w-[395px] md:py-6 tracking-[.2rem]">
      <div className="md:max-w-[395px] mx-auto">
        <div className="hidden md:block">
          {data.length > 0 ? (
            <Swiper
              effect="fade"
              modules={[EffectFade, Autoplay]}
              speed={1300}
              fadeEffect={{ crossFade: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              onSlideChange={(swiper) => {
                const newDelay = swiper.activeIndex === 0 ? 7000 : 3000;
                if (
                  swiper.params.autoplay &&
                  typeof swiper.params.autoplay !== "boolean"
                ) {
                  swiper.params.autoplay.delay = newDelay;
                  swiper.autoplay?.start();
                }
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 1,
                },
                1024: {
                  slidesPerView: 1,
                },
              }}
            >
              {data.map((value) => {
                return (
                  <SwiperSlide key={value.id}>
                    <Link href={`posts/${value.id}`}>
                      <Photo src={value?.signedUrl} alt={value.title} />
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p>投稿がありません。</p>
          )}
        </div>
        <div className="md:hidden block">
          <Link href={`posts/${data[0].id}`}>
            <Photo src={data[0]?.signedUrl} alt={data[0].title} />
          </Link>
        </div>
      </div>
    </div>
  );
}
