import CreatePost from "@/components/posts/createPost";
import Link from "next/link";
import CustomButton from "@/components/shared/customButton";

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
            <CustomButton>投稿一覧に戻る</CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
