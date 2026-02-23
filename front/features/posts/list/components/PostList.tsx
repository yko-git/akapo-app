"use client";
import Link from "next/link";
import PhotoList from "@/shared/components/photoList";
import TagList from "@/shared/components/tagList";
import Image from "next/image";
import { PostListProps } from "@/shared/types";

export default function PostList({ posts }: PostListProps) {
  return (
    <ul className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-20 gap-x-5 max-w-[1400px] mx-auto md:mt-10 px-5">
      {posts.map((item, index) => (
        <li key={item.id || index}>
          <div className="mt-4">
            <Link href={`/posts/${item.id}`}>
              <PhotoList
                src={item.signedUrl}
                alt={item.title}
                width={280}
                height={280}
              />
            </Link>
          </div>
          <div className="px-4">
            <div className="mt-4 flex justify-between">
              <ul>
                <TagList categories={item.categories} />
              </ul>
              <div className="text-sm mt-2 relative">
                {item.hasNewComment && (
                  <p className="bg-red-500 text-white px-2 py-1 rounded-sm text-[9px] absolute -top-9 right-0 text-nowrap">
                    NEW COMMENT
                  </p>
                )}
                コメント {item.commentCount} 件
              </div>
            </div>
            <div className="font-semibold mt-4">{item.title}</div>
            <div className="flex items-center justify-between mt-2 text-[#807f7f]">
              <div className="flex items-center">
                <Link
                  href={`/?user=${item.user.id}`}
                  className="flex items-center"
                >
                  <Image
                    className="inline-block mr-2 rounded-full object-cover w-[31px] h-[31px]"
                    src={item.user.iconSignedUrl}
                    alt=""
                    width={31}
                    height={31}
                    loading="lazy"
                  />
                  <p className="text-sm">{item.user.name}</p>
                </Link>
              </div>
              <p className="text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
