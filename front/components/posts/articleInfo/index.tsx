import Link from "next/link";
import { jost } from "@/components/shared/font";
import { ArticleData, Post } from "@/api/fetchData";

export default function ArticleInfo({ data }: ArticleData<Post[]>) {
  return (
    <div className="bg-white rounded-xl shadow-md py-9 md:px-20 px-8 md:flex items-center">
      <h3
        className={`${jost.className} text-sm text-[#6C9FE0] tracking-[.15rem] font-bold md:mb-0 mb-5`}
      >
        NEW POST
      </h3>
      <ul className="md:ml-24 md:text-sm text-xs md:space-y-1 space-y-4">
        {data.slice(0, 3).map((item, index) => (
          <li key={index}>
            <Link
              href={`/posts/${item.id}`}
              className="tracking-[.15rem] md:flex py-3"
            >
              <div
                className={`${jost.className} md:mr-4 md:mb-0 mb-1 text-[#9F9F9F] font-bold md:min-w-32`}
              >
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
