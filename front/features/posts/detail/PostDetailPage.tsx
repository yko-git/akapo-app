"use client";
import { useParams } from "next/navigation";
import PostDetail from "./components/PostDetail";

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  return <PostDetail id={postId} />;
}
