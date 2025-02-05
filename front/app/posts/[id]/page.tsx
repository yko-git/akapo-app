"use client";
import { useParams } from "next/navigation";
import Article from "@/components/posts/article";

export default function Page() {
  const { id } = useParams();
  const postId = Number(id);
  return (
    <div className="m-4">
      <Article id={postId} />
    </div>
  );
}
