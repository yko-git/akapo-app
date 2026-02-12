import { jost } from "@/components/shared/font";
import Link from "next/link";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
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
            <LoginForm />
          </div>
          <div className="mt-10 text-center">
            <h2 className="font-bold tracking-wide text-[#161616]">
              <Link href="/signup" className="underline">
                新規アカウント登録はこちら
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
