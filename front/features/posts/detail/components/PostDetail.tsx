"use client";
import { useEffect } from "react";
import Link from "next/link";
import { jost } from "@/components/shared/font";
import TagList from "@/components/shared/tagList";
import Photo from "@/components/shared/photo";
import CommentList from "@/components/posts/commentList";
import StatusInfo from "@/components/shared/statusInfo";
import { usePostStore } from "@/stores/usePostStore";
import { useCommentStore } from "@/stores/useCommentStore";
import Image from "next/image";
import { useRequireAuth } from "@/features/posts/shared/hooks";
import { fetchPost } from "../../shared/api";
import { fetchComments } from "../../shared/api/fetchComments";
import CreateComment from "@/features/comments/create/components/CreateComment";

export default function PostDetail({ id }: { id: number }) {
  const { setComments, reset } = useCommentStore();
  const {
    currentPost,
    isLoading,
    error,
    setCurrentPost,
    setLoading,
    setError,
  } = usePostStore();

  const isAuthChecked = useRequireAuth();
  useEffect(() => {
    if (!isAuthChecked) return; // 認証チェックが完了していない場合はデータ取得をスキップ
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const postData = await fetchPost({ id });
        setCurrentPost(postData);
        const commentList = await fetchComments({ postId: id });
        setComments(commentList);
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

    // クリーンアップ関数でcurrentPostをリセット
    return () => {
      setCurrentPost(null);
      reset();
    };
  }, [id, isAuthChecked, setCurrentPost, setLoading, setError, setComments]);

  if (isLoading) return <StatusInfo status="loading" data={null} />;
  if (error) return <StatusInfo status="service-down" data={null} />;
  if (!currentPost) return <StatusInfo status="service-down" data={null} />;

  return (
    <>
      <div className="wrapper">
        <div className="md:my-10">
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
        </div>
        <div className="md:mt-12">
          <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-10 gap-10">
            <Photo src={currentPost.signedUrl} alt={currentPost.title} />

            <div className="md:pl-10 tracking-[.2em] relative md:min-w-96">
              <div className="inline-block text-center md:absolute right-0 -top-2 md:mt-0 mt-4">
                <div className="md:block flex items-center text-center">
                  <Image
                    className="inline-block mr-2 rounded-full object-cover md:w-[90px] md:h-[90px] w-[40px] h-[40px]"
                    src={currentPost.user.iconSignedUrl}
                    alt=""
                    width={90}
                    height={90}
                    loading="lazy"
                  />
                  <p className="text-[12px] md:mt-1">{currentPost.user.name}</p>
                </div>
              </div>
              <div className="md:block flex justify-between">
                <ul className="mt-2">
                  <TagList categories={currentPost.categories} />
                </ul>
                <p className="text-[#9F9F9F] text-[12px] mt-4 ">
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="md:mt-12 mt-4 md:text-[27px] text-lg leading-9 font-bold">
                {currentPost.title}
              </div>

              <div className="md:block hidden mt-4 leading-8 text-slate-500">
                {currentPost.body
                  .split("\n")
                  .map((item: string, index: number) => (
                    <p key={index}>{item}</p>
                  ))}
              </div>
            </div>
          </div>
          <div className="md:hidden block mt-4">
            <div className="mt-4 leading-8 text-slate-500">
              {currentPost.body
                .split("\n")
                .map((item: string, index: number) => (
                  <p key={index}>{item}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="md:py-20 py-10 text-center bg-[#F5F8FD] -mt-8">
        <div className="wrapper">
          <h2
            className={`${jost.className} jost text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            COMMENTS
          </h2>
          <div className="text-left">
            <CommentList postId={id} postUserId={currentPost.user.id} />

            <CreateComment postId={id} />
          </div>
        </div>
      </div>
    </>
  );
}
