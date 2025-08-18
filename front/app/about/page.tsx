import Image from "next/image";
import Link from "next/link";
import { jost } from "@/components/shared/font";
import logo from "@/public/common/logo.svg";
import Button from "@/components/shared/button";

export default function About() {
  return (
    <>
      <div className="m-4 wrapper">
        <div className="mx-auto max-w-[680px] text-center md:pt-48 pt-14">
          <div className="md:inline-flex items-center">
            <h1
              className={`${jost.className} md:text-[35px] text-lg text-[#6C9FE0] tracking-[.2rem] font-semibold md:mr-10 md:mb-0 mb-2`}
            >
              ABOUT
            </h1>
            <Image
              src={logo}
              loading="lazy"
              alt=""
              width={382}
              height={117}
              className="mx-auto"
            />
          </div>
          <div className="text-center mt-28">
            <Image
              src="/about/img-01.png"
              loading="lazy"
              alt=""
              width={673}
              height={437}
            />
          </div>
        </div>

        <div className="md:flex justify-center items-center md:mt-32 mt-16 gap-12">
          <div className="text-sm font-semibold md:leading-[2rem] leading-7 tracking-[.22em] 　text-[#657994] max-w-[418px]">
            <p>
              このギャラリーは、工作が大好きな子どもたちの作品を気軽に残して、みんなで楽しめるサイトです。
              <br />
              ママエンジニアが自分の子どもの作品を残すために立ち上げましたが、他の方も自由にアカウントを作って作品を投稿できます。
            </p>
          </div>

          <div className="md:text-left text-center md:mt-0 mt-5">
            <Link href="/signup">
              <Button
                mode="Info"
                className="md:py-12 md:px-20 py-6 px-10 text-white md:text-3xl font-semibold tracking-widest rounded-lg mx-auto inline-block"
              >
                新規ユーザー登録
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
