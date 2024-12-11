import Main from "@/components/posts/main";
import Link from "next/link";
import CustomButton from "@/components/shared/customButton";

export default function Page() {
  return (
    <>
      <Main />
      <hr />
      <div className="m-4 wrapper text-right">
        <Link href="/posts/new">
          <CustomButton>新しい投稿を作成</CustomButton>
        </Link>
      </div>
    </>
  );
}
