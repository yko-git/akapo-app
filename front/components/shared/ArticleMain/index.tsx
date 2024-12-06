"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Post } from "@/types";

export default function ArticleMain() {
  const [data, setData] = useState<Post[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const getMockUserToken = async () => {
          try {
            const response = await axios.post("http://localhost:3001/mockurl");
            const { token } = response.data;
            setToken(token);
            return token;
          } catch (error) {
            console.error("モックユーザーのトークン取得に失敗しました", error);
            return null;
          }
        };

        const userToken = await getMockUserToken();
        const res = await axios.get("http://localhost:3001/posts", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const items = res.data;
        setData(items.posts);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const reSignedUrl = async (postId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/re-signedurl`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.signedUrl;
    } catch (error) {
      console.error("署名付きURLの再取得に失敗しました", error);
      return null;
    }
  };

  return (
    <div className="md:my-5 md:w-[395px] md:py-6 tracking-[.2rem]">
      <div className="md:max-w-[395px] mx-auto">
        <div className="relative">
          {data.length > 0 ? (
            <>
              <div>
                <Link href={`posts/${data[data.length - 1].id}`}>
                  <img
                    src={data[data.length - 1]?.signedUrl}
                    alt="Uploaded"
                    width={395}
                    height={500}
                    onError={async (e) => {
                      // 署名付きURLが期限切れの場合に新しいURLを取得して再設定
                      const newUrl = await reSignedUrl(data[0].id);
                      if (newUrl) {
                        (e.target as HTMLImageElement).src = newUrl;
                      }
                    }}
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
