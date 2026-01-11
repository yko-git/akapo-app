"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/schemas/post.schema";
import { Comment } from "@/schemas/comment.schema";
import { fetchPost, fetchComments } from "@/api/fetchData";
import { jost } from "@/components/shared/font";
import Image from "next/image";
import TagList from "@/components/shared/tagList";
import Photo from "@/components/shared/photo";
import CommentList from "@/components/posts/commentList";
import CreateComment from "@/components/posts/createComment";
import StatusInfo from "@/components/shared/statusInfo";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function Article({ id }: { id: number }) {
  const [status, setStatus] = useState<"loading" | "service-down" | "success">(
    "loading"
  );
  const [data, setData] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const handleCommentAdded = async () => {
    const commentList = await fetchComments({ postId: id });
    setComments(commentList);
  };
  const isAuthChecked = useRequireAuth();
  useEffect(() => {
    if (!isAuthChecked) return; // 認証チェックが完了していない場合はデータ取得をスキップ
    async function fetchData() {
      try {
        const post = await fetchPost({ id });
        if (Array.isArray(post) && post.length > 0) {
          setData(post[0]);
        }
        const commentList = await fetchComments({ postId: id });
        setComments(commentList);
        setStatus("success");
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
        setStatus("service-down");
      }
    }

    fetchData();
  }, [id, isAuthChecked]);

  if (status !== "success" || data === null) {
    return <StatusInfo status={status} data={data} />;
  }

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
            <Photo src={data.signedUrl} alt={data.title} />

            <div className="md:pl-10 tracking-[.2em] relative md:min-w-96">
              <div className="inline-block text-center md:absolute right-0 -top-2 md:mt-0 mt-4">
                {data ? (
                  <>
                    <div className="md:block flex items-center text-center">
                      <img
                        className="inline-block mr-2 rounded-full object-cover md:w-[90px] md:h-[90px] w-[40px] h-[40px]"
                        src={data.user.iconSignedUrl}
                        alt=""
                        width={90}
                        height={90}
                        loading="lazy"
                      />
                      <p className="text-[12px] md:mt-1">{data.user.name}</p>
                    </div>
                  </>
                ) : (
                  <p>ユーザー情報を読み込んでいます...</p>
                )}
              </div>
              <div className="md:block flex justify-between">
                <ul className="mt-2">
                  <TagList Categories={data.categories} />
                </ul>
                <p className="text-[#9F9F9F] text-[12px] mt-4 ">
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="md:mt-12 mt-4 md:text-[27px] text-lg leading-9 font-bold">
                {data.title}
              </div>

              <div className="md:block hidden mt-4 leading-8 text-slate-500">
                {data.body.split("\n").map((item: string, index: number) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden block mt-4">
            <div className="mt-4 leading-8 text-slate-500">
              {data.body.split("\n").map((item: string, index: number) => (
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
            {!comments || comments.length === 0 ? (
              <div className="mt-20">
                <p className="text-center font-bold tracking-wider">
                  コメントをとうこうしてね
                </p>
              </div>
            ) : (
              <CommentList
                id={id}
                comments={comments}
                postUserId={data.user.id}
                setComments={setComments}
              />
            )}

            <CreateComment postId={id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      </div>
    </>
  );
}
