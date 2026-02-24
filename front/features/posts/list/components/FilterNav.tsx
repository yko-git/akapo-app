"use client";
import { CATEGORIES_TYPES } from "@/shared/constants/categories";
import { FilterNavProps } from "@/shared/types";
import Link from "next/link";

export default function FilterNav({
  categoryFilter,
  userNameFilter,
}: FilterNavProps) {
  return (
    <div>
      {userNameFilter && (
        <p className="mb-5">
          <span className="font-bold">{userNameFilter}</span> の投稿一覧
        </p>
      )}
      <nav>
        {CATEGORIES_TYPES.map((cat) => {
          const isActive = categoryFilter === cat.value;
          return (
            <Link
              key={cat.value}
              href={isActive ? "/" : `/?category=${cat.value}`}
              className={`text-xs inline-block mt-1 text-white mr-2 px-3 py-1 text-[10px] font-semibold rounded-sm ${
                isActive ? "bg-[#FC7840]" : "bg-[#6C9FE0]"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
        <Link
          key="99"
          href="/"
          className={`text-xs inline-block mt-1 mr-2 px-3 text-[10px] font-semibold rounded-sm ${
            categoryFilter === null
              ? "bg-[#FC7840] text-white py-1"
              : "bg-white border-[#6C9FE0] border-2 py-0.5 text-[#6C9FE0]"
          }`}
        >
          すべて
        </Link>
      </nav>
    </div>
  );
}
