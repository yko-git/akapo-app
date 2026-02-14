import { jost } from "@/shared/components/font";
import CreateUser from "./components/CreateUser";

export default function CreateUserPage() {
  return (
    <>
      <div className="m-4 wrapper">
        <div className="md:flex justify-center items-center gap-12">
          <h3
            className={`${jost.className} md:text-[53px] text-[22px] text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            Signin
          </h3>
          <p className="text-[#878787] md:text-lg font-semibold tracking-widest md:mt-0 mt-3">
            ログイン・新規ユーザー登録は
            <br />
            午前9時〜午後9時の間にご利用いただけます
          </p>
        </div>
        <div className="text-center mt-6">
          <h3 className="font-semibold text-2xl tracking-widest text-[#161616]">
            新規ユーザー登録
          </h3>
        </div>
        <div className="max-w-[448px] mx-auto mt-9">
          <CreateUser />
        </div>
      </div>
    </>
  );
}
