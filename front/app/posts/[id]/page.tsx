"use client";
import { useParams } from "next/navigation";
import Article from "@/components/posts/article";

export default function Page() {
  const { id } = useParams();
  const postId = Number(id);
  return <Article id={postId} />;
}
