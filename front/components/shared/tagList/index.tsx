import { TagListProps } from "@/types";

export default function TagList({ categories = [] }: TagListProps) {
  return (
    <ul>
      {categories.map((category, index) => (
        <li
          className="text-xs inline-block mt-1 text-white bg-[#6C9FE0] mr-2 px-3 py-1 text-[10px] font-semibold rounded-sm"
          key={index}
        >
          {category.name}
        </li>
      ))}
    </ul>
  );
}
