import Link from "next/link";
import PostList from "@/components/PostList";

export default function Page() {
  return (
    <>
      <div className="m-4">
        <Link href="/posts">
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            新しい投稿を作成
          </button>
        </Link>
      </div>
      <hr />
      <PostList />
    </>
  );
}
