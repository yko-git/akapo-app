"use client";
import React, { useState, useEffect } from "react";
import { createComment } from "@/api/fetchData";
import Button from "@/components/shared/button";

interface CreateComment {
  postId: number;
}

export default function CreateComment({ postId }: CreateComment) {
  const [body, setBody] = useState<string>("");

  const handleSubmit = async () => {
    const postData = { body, postId };
    try {
      await createComment(postId, postData);
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
