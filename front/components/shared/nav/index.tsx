"use client";
import { jost } from "@/components/shared/font";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { LoginContext } from "../loginContext";

export interface Nav {
  login: boolean;
}

export const Nav = () => {
  const isLoggedIn = useContext(LoginContext);
  const navs = [
    {
      name: "HOME",
      link: "/",
    },
    {
      name: "ABOUT",
      link: "/about",
    },
    {
      name: "MYPAGE",
      link: "/mypage",
    },
    {
      name: "PROFILE",
      link: "/profile",
    },
  ];
  const pathname = usePathname();
  const isActive = (path: string) =>
    new RegExp(`^${path}(/.*)?$`).test(pathname);
  const linkClass = (active: boolean) =>
    `${jost.className} md:text-sm text-[45px] text-[#6C9FE0] tracking-[.2rem] ${
      active ? "border-b-2 border-[#6C9FE0]" : ""
    }`;

  return (
    <>
      {isLoggedIn?.isLoggedIn ? (
        navs.map(({ name, link }) => (
          <li key={name} className="px-4">
            <Link href={link} className={linkClass(isActive(link))}>
              {name}
            </Link>
          </li>
        ))
      ) : (
        <>
          <li className="px-4">
            <Link href="/login" className={linkClass(isActive("/login"))}>
              SIGNIN
            </Link>
          </li>
          <li className="px-4">
            <Link href="/about" className={linkClass(isActive("/about"))}>
              ABOUT
            </Link>
          </li>
        </>
      )}
    </>
  );
};
