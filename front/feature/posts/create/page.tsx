import Link from "next/link";
import Button from "@/components/shared/button";
import CreatePost from "./components/CreatePost";

export default function PostPage() {
  return (
    <div className="m-4">
      <div className="wrapper mb-10">
        <div className="text-center mt-6">
          <h3 className="font-semibold text-2xl tracking-widest text-[#161616]">
            新しい投稿を作成
          </h3>
        </div>
        <div className="max-w-[448px] mx-auto mt-9">
          <CreatePost />
        </div>
      </div>
      <hr />
      <div className="wrapper">
        <div className="my-4">
          <Link href="/">
            <Button
              mode="Info"
              className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
            >
              投稿一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
