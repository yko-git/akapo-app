import LoginUser from "@/components/posts/loginUser";
import { jost } from "@/components/shared/font";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="m-4 wrapper">
        <div className="md:flex justify-center items-center gap-12">
          <h3
            className={`${jost.className} md:text-[53px] text-[22px] text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            Login
          </h3>
          <p className="text-[#878787] md:text-lg font-semibold tracking-widest md:mt-0 mt-3">
            ログイン・新規ユーザー登録は
            <br />
            午前9時〜午後9時の間にご利用いただけます
          </p>
        </div>

        <div className="mt-6">
          <div className="max-w-[448px] mx-auto">
            <LoginUser />
          </div>
          <div className="text-center md:mt-20 mt-12">
            <h2 className="font-bold tracking-wide text-[#161616]">
              <Link href="/signup" className="underline">
                まだアカウントをお持ちでない方はこちら
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
