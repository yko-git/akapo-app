import Main from "@/components/shared/main";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Main />
      <hr />
      <div className="m-4 wrapper text-right">
        <Link href="/posts/new">
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            新しい投稿を作成
          </button>
        </Link>
      </div>
    </>
  );
}
