"use client";
import { jost } from "@/shared/components/font";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";
import { LoginContext } from "../loginContext";
import { NavProps } from "@/types";

export const Nav = ({ onLinkClick }: NavProps) => {
  const isLoggedIn = useContext(LoginContext);
  const navs = [
    { name: "HOME", link: "/" },
    { name: "ABOUT", link: "/about" },
    { name: "MYPAGE", link: "/mypage" },
    { name: "PROFILE", link: "/profile" },
  ];
  const pathname = usePathname();
  const isActive = (path: string) =>
    new RegExp(`^${path}(/.*)?$`).test(pathname);
  const linkClass = (active: boolean) =>
    `${jost.className} md:text-sm text-[45px] text-[#6C9FE0] tracking-[.2rem] ${
      active ? "border-b-2 border-[#6C9FE0]" : ""
    }`;

  const renderLinks = (links: typeof navs) =>
    links.map(({ name, link }) => (
      <li key={name} className="px-4">
        <Link
          href={link}
          className={linkClass(isActive(link))}
          onClick={onLinkClick}
        >
          {name}
        </Link>
      </li>
    ));

  return (
    <>
      {isLoggedIn?.isLoggedIn
        ? renderLinks(navs)
        : renderLinks([
            { name: "LOGIN", link: "/login" },
            { name: "SIGNIN", link: "/signup" },
            { name: "ABOUT", link: "/about" },
          ])}
    </>
  );
};
