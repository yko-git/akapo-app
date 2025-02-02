"use client";
import React, { useState } from "react";
import { createComment } from "@/api/fetchData";
import Button from "@/components/shared/button";

export default function CreateComment({ postId }: { postId: number }) {
  const [body, setBody] = useState<string>("");

  const handleSubmit = async () => {
    const postData = { body, postId };
    console.log(postData);
    try {
      await createComment(postId, postData);
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-4 text-left">
      <div>
        <div>コメント内容</div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <Button mode="Success" onClick={handleSubmit}>
        投稿する
      </Button>
    </div>
  );
}
