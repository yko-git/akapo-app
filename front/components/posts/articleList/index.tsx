"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/schemas/post.schema";
import { fetchPosts, fetchComments } from "@/api/fetchData";
import PhotoList from "@/components/shared/photoList";
import TagList from "@/components/shared/tagList";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ArticleList() {
  const [data, setData] = useState<Post[] | undefined>(undefined);

  const isAuthChecked = useRequireAuth();
  useEffect(() => {
    if (!isAuthChecked) return; // 認証チェックが完了していない場合はデータ取得をスキップ

    async function fetchData() {
      try {
        const posts = await fetchPosts();
        const sortedPosts = (posts ?? []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const postsWithComments = await Promise.all(
          sortedPosts.map(async (post) => {
            const comments = await fetchComments({ postId: post.id });
            const now = new Date();

            const hasNewComment = comments.some((comment) => {
              const commentDate = new Date(comment.createdAt);
              const diffMSec = now.getTime() - commentDate.getTime();
              const diffHour = diffMSec / (60 * 60 * 1000);
              return diffHour < 24;
            });
            return {
              ...post,
              commentCount: comments?.length || 0,
              hasNewComment,
            };
          })
        );
        setData(postsWithComments);
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
      }
    }
    fetchData();
  }, [isAuthChecked]);

  return (
    <>
      <ul className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-20 gap-x-5 max-w-[1400px] mx-auto md:mt-10 px-5">
        {data?.map((item, index) => (
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
            <div className="px-4">
              <div className="mt-4 flex justify-between">
                <ul>
                  <TagList categories={item.categories} />
                </ul>
                <div className="text-sm mt-2 relative">
                  {item.hasNewComment && (
                    <p className="bg-red-500 text-white px-2 py-1 rounded-sm text-[9px] absolute -top-9 right-0 text-nowrap">
                      NEW COMMENT
                    </p>
                  )}
                  コメント {item.commentCount} 件
                </div>
              </div>
              <div className="font-semibold mt-4">{item.title}</div>
              <div className="flex items-center justify-between mt-2 text-[#807f7f]">
                <div className="flex items-center">
                  <img
                    className="inline-block mr-2 rounded-full object-cover w-[31px] h-[31px] "
                    src={item.user.iconSignedUrl}
                    alt=""
                    width={31}
                    height={31}
                    loading="lazy"
                  />
                  <p className="text-sm">{item.user.name}</p>
                </div>
                <p className="text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
