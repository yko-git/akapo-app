"use client";
import { Comment } from "@/api/fetchData";
import React, { useState } from "react";
import { createComment } from "@/api/fetchData";
import Button from "@/components/shared/button";

interface CreateComment {
  postId: number;
  onNewComment: (comment: Comment) => void;
}
export default function CreateComment({ postId, onNewComment }: CreateComment) {
  const [body, setBody] = useState<string>("");

  const handleSubmit = async () => {
    const postData = { body, postId };
    console.log(postData);
    try {
      const newComment = await createComment(postId, postData);
      onNewComment(newComment);
      setBody("");
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="mt-20">
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
