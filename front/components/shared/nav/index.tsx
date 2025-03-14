"use client";
import { jost } from "@/components/shared/font";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface Nav {
  login: boolean;
}

export const Nav = ({ login }: Nav) => {
  const navs = [
    {
      name: "HOME",
      link: "/",
    },
    {
      name: "GALLERY",
      link: "/posts",
    },
    {
      name: "MYPAGE",
      link: "/mypage",
    },
  ];
  const pathname = usePathname();

  return (
    <>
      {navs.map((n) => {
        const isActive = new RegExp(`^${n.link}(/.*)?$`).test(pathname);
        return login ? (
          <li key={n.name} className="px-4">
            <Link
              href={n.link}
              className={`${jost.className} ${
                isActive
                  ? "border-b-2 border-[#6C9FE0] text-sm font-[15px] text-[#6C9FE0] tracking-[.2rem]"
                  : "text-sm font-[15px] text-[#6C9FE0] tracking-[.2rem]"
              } `}
            >
              {n.name}
            </Link>
          </li>
        ) : null;
      })}
    </>
  );
};
