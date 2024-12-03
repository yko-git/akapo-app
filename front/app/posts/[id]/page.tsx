"use client";
import { useParams } from "next/navigation";
import Article from "@/shared/components/Article";

export default function Page() {
  const { id } = useParams();
  const postId = Number(id);
  return (
    <div className="m-4">
      <div className="wrapper">
        <Article id={postId} />
      </div>
    </div>
  );
}
