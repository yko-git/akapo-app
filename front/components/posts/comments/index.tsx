"use client";
import { useEffect, useState } from "react";
import { jost } from "@/components/shared/font";
import CommentList from "@/components/posts/commentList";
import CreateComment from "@/components/posts/createComment";
import { fetchComments, Comment } from "@/api/fetchData";

interface CommentsProps {
  postId: number;
  id: number;
}

export default function Comments({ postId, id }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const commentList = await fetchComments({ postId: id });
        setComments(commentList);
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
      }
    }

    fetchData();
  }, [id]);
  const handleNewComment = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };
  return (
    <>
      <div className="py-20 text-center bg-[#F5F8FD] -mt-8">
        <div className="wrapper">
          <h2
            className={`${jost.className} jost text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            COMMENTS
          </h2>
          <div className="text-left">
            <CommentList comments={comments} id={id} />
            <CreateComment postId={postId} onNewComment={handleNewComment} />
          </div>
        </div>
      </div>
    </>
  );
}
