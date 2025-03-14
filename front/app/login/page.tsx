import LoginUser from "@/components/posts/loginUser";
import Button from "@/components/shared/button";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="m-4 wrapper">
        <h1 className="font-bold my-2">ログインまたは新規ユーザー登録</h1>
        <div className="mt-10">
          <div>
            <LoginUser />
          </div>
          <div className="text-center md:mt-20 mt-12">
            <h2 className="font-bold">新規ユーザー登録</h2>
            <div className="mt-5">
              <p>
                akapoを使用するには、
                <br className="md:hidden" />
                サインアップが必要です。
              </p>
              <div className="mt-5">
                <Link href="/signup">
                  <Button mode="Success">サインアップ</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
