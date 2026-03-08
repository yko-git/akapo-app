import Image from "next/image";
import { jost } from "@/shared/components/font";

export default function ProfilePage() {
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
                <li className="md:flex">
                  <span className="font-bold whitespace-nowrap text-[#2F4561] md:inline block md:mr-6 mr-0">
                    紹　介
                  </span>
                  散歩やものづくりが好きなママです。
                  <br />
                  「akapo」は、自身の学習やインプットを目的に開発しており、React
                  / Next.js / TypeScript を使用しています。
                  <br />
                  バックエンドには AWS（EC2 / RDS / S3）や Cloudflare
                  を活用しています。
                  <br />
                  開発途中のため、頻繁にアップデートを行っています！
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
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
