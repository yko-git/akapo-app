"use client";
import React, { useState } from "react";
import Button from "@/shared/components/button";
import { useCommentStore } from "@/shared/stores";
import { CreateCommentProps } from "@/shared/types";
import { createComment } from "../api";

export default function CreateComment({ postId }: CreateCommentProps) {
  const [body, setBody] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useCommentStore();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const postData = { body, postId };
    try {
      const newComment = await createComment(postId, postData);
      addComment(newComment);
      setBody("");
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
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
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={isSubmitting}
          className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
        >
          {isSubmitting ? "コメント送信中..." : "コメントする"}
        </Button>
      </div>
    </div>
  );
}
