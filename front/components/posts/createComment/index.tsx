"use client";
import { Comment } from "@/api/fetchData";
import React, { useState, useEffect } from "react";
import { createComment } from "@/api/fetchData";
import Button from "@/components/shared/button";
import CommentList from "@/components/posts/commentList";

interface CreateCommentProps {
  postId: number;
  onNewComment: (comment: Comment) => void;
  comments: Comment[];
  id: number;
}

export default function CreateComment({
  postId,
  onNewComment,
  comments,
  id,
}: CreateCommentProps) {
  const [body, setBody] = useState<string>("");

  const handleSubmit = async () => {
    const postData = { body, postId };
    try {
      const newComment = await createComment(postId, postData);
      onNewComment(newComment); // コメントを親コンポーネントに渡して即時反映
      setBody("");
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="mt-20">
      {/* コメントリストの表示 */}
      <CommentList comments={comments} id={id} />
      <div>
        <div className="font-bold">コメントをいれる</div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border rounded p-2 w-full mt-2"
        />
      </div>
      <div className="text-right mt-4">
        <Button mode="Success" onClick={handleSubmit}>
          投稿する
        </Button>
      </div>
    </div>
  );
}
