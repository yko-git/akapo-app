import CreatePost from "@/components/CreatePost";
import Link from "next/link";

export default function PostPage() {
  return (
    <div className="m-4">
      <h1 className="font-bold my-2">新しい投稿を作成</h1>
      <CreatePost />
      <hr />
      <div className="my-4">
        <Link href="/">
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            投稿一覧に戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
