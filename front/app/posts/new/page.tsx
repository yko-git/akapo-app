import CreatePost from "@/components/posts/createPost";
import Link from "next/link";
import Button from "@/components/shared/button";

export default function PostPage() {
  return (
    <div className="m-4">
      <div className="wrapper">
        <h1 className="font-bold my-2">新しい投稿を作成</h1>
        <CreatePost />
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
