"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/common/logo.svg";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Nav } from "@/shared/components/nav";

export default function Header() {
  // visibleの値を変えることでメニューを表示・非表示させる
  const [visible, setVisible] = useState<"hidden" | "visible">("hidden");

  // 画面の大きさの判定ができる
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });
  const toggleHamburger = () => {
    setVisible(visible === "visible" ? "hidden" : "visible");
  };

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (isDesktopOrLaptop) {
      setVisible("visible");
    } else {
      setVisible("hidden");
    }
  }, [isDesktopOrLaptop]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
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
              className={`${visible} fixed inset-0 bg-white bg-opacity-95 lg:static lg:bg-transparent px-5 lg:px-0 py-3 lg:py-0 z-20`}
            >
              <ul className="flex flex-col items-center justify-center h-full md:gap-5 gap-10 lg:flex-row lg:static">
                <Nav
                  onLinkClick={() => {
                    if (!isDesktopOrLaptop) setVisible("hidden");
                  }}
                />
              </ul>
            </nav>
            {!isDesktopOrLaptop && (
              <button
                onClick={toggleHamburger}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-[#6C9FE0] ring-indigo-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden z-20"
              >
                {visible === "visible" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
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
                )}
              </button>
            )}
          </header>
        </div>
      </div>
    </header>
  );
}
