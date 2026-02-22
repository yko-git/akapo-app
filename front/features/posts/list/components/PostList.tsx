"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePostStore, PostWithComments } from "@/shared/stores/usePostStore";
import PhotoList from "@/shared/components/photoList";
import TagList from "@/shared/components/tagList";
import StatusInfo from "@/shared/components/statusInfo";
import Image from "next/image";
import { useRequireAuth } from "../../shared/hooks";
import { fetchComments } from "../../shared/api/fetchComments";
import { fetchPosts } from "../api";
import { useCategoryFilter } from "../hooks";

export default function PostList() {
  // Storeから必要なデータと関数を取得
  const { posts, isLoading, error, setPosts, setLoading, setError } =
    usePostStore();
  const isAuthChecked = useRequireAuth();
  // URLクエリからカテゴリーフィルターの状態を取得
  const { category } = useCategoryFilter();

  useEffect(() => {
    if (!isAuthChecked) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const postsData = await fetchPosts();

        // 日付でソート
        const sortedPosts = (postsData ?? []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        // コメント情報を追加
        const postsWithComments: PostWithComments[] = await Promise.all(
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
          }),
        );

        // カテゴリーフィルターの適用
        if (category !== null) {
          const filteredPosts = postsWithComments.filter((post) =>
            post.categories.some((cat) => cat.name === category),
          );
          setPosts(filteredPosts);
          return;
        }
        setPosts(postsWithComments);
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
        setError(
          error instanceof Error ? error.message : "投稿の取得に失敗しました",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthChecked, category, setPosts, setLoading, setError]);

  if (isLoading) return <StatusInfo status="loading" data={null} />;
  if (error) return <StatusInfo status="service-down" data={null} />;
  if (!posts || posts.length === 0)
    return <StatusInfo status="empty" data={null} />;

  return (
    <ul className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-20 gap-x-5 max-w-[1400px] mx-auto md:mt-10 px-5">
      {posts.map((item, index) => (
        <li key={item.id || index}>
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
                <Image
                  className="inline-block mr-2 rounded-full object-cover w-[31px] h-[31px]"
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
  );
}
