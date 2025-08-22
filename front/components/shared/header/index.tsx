"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/common/logo.svg";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Nav } from "@/components/shared/nav";
import { LoginContext } from "../loginContext";

export default function Header() {
  const isLoggedIn = useContext(LoginContext);

  // visibleの値を変えることでメニューを表示・非表示させる
  const [visible, setVisible] = useState("visible");

  // 画面の大きさの判定ができる
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });
  const toggleHamburger = () =>
    setVisible(visible === "visible" ? "hidden" : "visible");

  // 画面のサイズが1024pxより大きくなるとisDesktopOrLaptopの値がtrueになる
  // isDesktopOrLaptopの値が変わる度にuseEffectは実行される
  useEffect(() => {
    if (!isDesktopOrLaptop) setVisible("hidden");
    else setVisible("visible");
  }, [isDesktopOrLaptop]);
  return (
    <header className="sticky top-0 bg-white bg-opacity-90 z-10">
      <div className="wrapper lg:pb-10 !pb-0 !pt-0">
        <div className="mx-auto max-w-screen-2xl">
          <header className="flex items-center justify-between py-4 md:py-8 relative md:gap-0 gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-3xl font-bold text-black md:text-3xl"
              aria-label="logo"
            >
              <Image
                src={logo}
                className="md:w-[184px] w-[124px]"
                loading="lazy"
                width="184"
                height="56"
                alt=""
              />
            </Link>

            <nav
              className={`${visible} absolute -right-4 bg-opacity-90 top-[100%] lg:static bg-white lg:bg-transparent px-5 lg:px-0 py-3 lg:py-0 shadow-sm lg:shadow-none z-10`}
            >
              <ul className="gap-13 lg:flex lg:static">
                <Nav />
              </ul>
            </nav>
            {isLoggedIn?.isLoggedIn && (
              <button
                onClick={toggleHamburger}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Menu
              </button>
            )}
          </header>
        </div>
      </div>
    </header>
  );
}
