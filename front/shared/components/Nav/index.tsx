"use client";
import { jost } from "@/shared/components/Font";
import { usePathname } from "next/navigation";

// "use client";
import Link from "next/link";

export function Nav() {
  const navs = [
    {
      name: "HOME",
      link: "/",
    },
    {
      name: "GALLERY",
      link: "/postlist",
    },
    {
      name: "ABOUT",
      link: "/about",
    },
    // {
    //   name: "CONTACT",
    //   link: "/contact",
    // },
  ];
  const pathname = usePathname();

  return (
    <>
      {navs.map((n) => {
        const isActive = pathname.endsWith(n.link);
        return (
          <li key={JSON.stringify(n.name)} className="px-4">
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
        );
      })}
    </>
  );
}
