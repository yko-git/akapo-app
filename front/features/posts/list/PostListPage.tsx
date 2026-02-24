"use client";
import { PostWithComments, usePostStore } from "@/shared/stores";
import FilterNav from "./components/FilterNav";
import PostList from "./components/PostList";
import StatusInfo from "@/shared/components/statusInfo";
import { useRequireAuth } from "../shared/hooks";
import { useCategoryFilter, usePostsFilter } from "./hooks";
import { useEffect } from "react";
import { fetchComments, fetchPosts } from "@/shared/api/fetchData";
import Link from "next/link";
import { jost } from "@/shared/components/font";

export default function PostListPage() {
  // Storeから必要なデータと関数を取得
  const { posts, setPosts, isLoading, error, setLoading, setError } =
    usePostStore();

  // Storeから必要なデータと関数を取得
  const isAuthChecked = useRequireAuth();
  // URLクエリからカテゴリーフィルターの状態を取得
  const { category } = useCategoryFilter();
  // 投稿の取得と状態管理
  const { userName } = usePostsFilter();

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
            post.categories.some((cat) => String(cat.id) === category),
          );
          setPosts(filteredPosts);
          return;
        }

        // ユーザーフィルターの適用
        if (userName !== null) {
          const filteredPosts = postsWithComments.filter(
            (post) => post.user.name === userName,
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
  }, [isAuthChecked, category, userName, setPosts, setLoading, setError]);

  if (isLoading) return <StatusInfo status="loading" data={null} />;
  if (error) return <StatusInfo status="service-down" data={null} />;
  return (
    <>
      <div className="md:m-4 md:mt-4 md:mx-auto md:mb-20">
        {!posts || posts.length === 0 ? (
          <StatusInfo status="empty" data={null} />
        ) : (
          <>
            <div className="wrapper mb-5">
              {userName && (
                <>
                  <p className="text-center mb-5">
                    <span className="font-bold text-2xl">{userName}</span>{" "}
                    の投稿一覧
                  </p>
                  <Link
                    href="/"
                    className={`${jost.className} tracking-[.2em] pr-5 inline-flex items-center rounded-lg text-[#6C9FE0] text-sm`}
                  >
                    <div className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        ></path>
                      </svg>
                    </div>
                    BACK
                  </Link>
                </>
              )}
              <div className="text-center">
                {!userName && <FilterNav categoryFilter={category} />}
              </div>
            </div>
            <PostList posts={posts} />
          </>
        )}
      </div>
    </>
  );
}
