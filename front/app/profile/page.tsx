import Image from "next/image";
import Link from "next/link";
import { jost } from "@/components/shared/font";

export default function Profile() {
  return (
    <>
      <div className="m-4 wrapper">
        <div className="text-center md:mb-20 mb-10">
          <h3
            className={`${jost.className} md:text-[53px] text-[22px] text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            Profile
          </h3>
          <div className="md:flex mt-11 md:text-left text-center md:px-4 px-2">
            <Image
              src="/profile/img-01.png"
              loading="lazy"
              alt=""
              width={115}
              height={115}
              className="mr-0 w-[115px] h-[115px] md:mr-10 inline-block"
            />
            <div className="pb-12 md:pt-0 pt-7">
              <ul className="text-left text-[#657994] tracking-[.15rem] leading-7 text-sm space-y-4">
                <li className="flex">
                  <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline block md:mr-6 mr-4">
                    住まい
                  </span>
                  東京都
                </li>
                <li className="md:flex">
                  <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline block md:mr-6 mr-0">
                    紹　介
                  </span>
                  散歩やものづくりが好きなママです。
                  <br />
                  「Akapo」は、自身の学習やインプットを目的に開発しており、React
                  / Next.js / TypeScript を使用しています。
                  <br />
                  バックエンドには AWS（EC2 / RDS / S3）や Cloudflare
                  を活用しています。
                  <br />
                  まだまだ開発途中のため、頻繁にアップデートを行っています！
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-[#E7E7E7] pt-10 md:px-4 px-2">
            <ul className="text-left text-[#657994] tracking-[.15rem] leading-7 text-sm space-y-4">
              <li className="md:flex">
                <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline block md:mr-6 mr-0">
                  言　語
                </span>
                HTML, JavaScript, CSS, PHP, React, Vue, TypeScript, Next.js...
              </li>
              <li className="md:flex">
                <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline block md:mr-6 mr-0">
                  TOOL
                </span>
                Photoshop, Illustrator, Figma, XD, VScode, git, github, Docker
                ...
              </li>
              <li className="md:flex">
                <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline block md:mr-6 mr-0">
                  経　歴
                </span>
                21歳のときに都内のデザイン制作会社でキャリアをスタートし、
                <br />
                主にWebページの作成からフロントエンド開発まで、幅広い業務を経験してきました。
              </li>
              {/* <li className="md:flex">
                <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline-flex items-center block md:mr-6 mr-0">
                  <span>学習記録</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    className="ml-1 inline-block"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    ></path>
                  </svg>
                </span>
                <Link
                  href="https://github.com/yko-git/til/"
                  target="_blank"
                  className="underline"
                >
                  https://github.com/yko-git/til
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
