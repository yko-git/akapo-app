"use client";
import PatchPost from "@/components/posts/patchPost";
import Link from "next/link";
import Button from "@/components/shared/button";
import { useParams } from "next/navigation";

export default function PatchPage() {
  const params = useParams();
  const id = Number(params.id);
  return (
    <div className="m-4">
      <div className="wrapper">
        <h1 className="font-bold my-2">投稿を編集</h1>
        <PatchPost id={id} />
      </div>
      <hr />
      <div className="wrapper">
        <div className="my-4">
          <Link href="/posts">
            <Button>投稿一覧に戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
