"use client";
import { CATEGORIES_TYPES } from "@/shared/constants/categories";
import { useCategoryFilter } from "../hooks";
import Link from "next/link";

export default function FilterNav() {
  // URLクエリからカテゴリーフィルターの状態を取得
  const categoryFilter = useCategoryFilter();

  return (
    <nav>
      {CATEGORIES_TYPES.map((category) => {
        const isActive = categoryFilter.category === category.value;
        return (
          <Link
            key={category.value}
            href={isActive ? "/" : `/?category=${category.value}`}
            className={`text-xs inline-block mt-1 text-white mr-2 px-3 py-1 text-[10px] font-semibold rounded-sm ${
              isActive ? "bg-[#FC7840]" : "bg-[#6C9FE0]"
            }`}
          >
            {category.label}
          </Link>
        );
      })}
      <Link
        key="99"
        href="/"
        className={`text-xs inline-block mt-1 mr-2 px-3 text-[10px] font-semibold rounded-sm ${
          categoryFilter.category === null
            ? "bg-[#FC7840] text-white py-1"
            : "bg-white border-[#6C9FE0] border-2 py-0.5 text-[#6C9FE0]"
        }`}
      >
        すべて
      </Link>
    </nav>
  );
}
