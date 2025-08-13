"use client";
import Link from "next/link";
import Image from "next/image";
import { Post, deletePost } from "@/api/fetchData";
import Button from "@/components/shared/button";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface UserArticleListProps {
  data: Post[] | null;
  setData: Dispatch<SetStateAction<Post[] | null>>;
}

export default function UserArticleList({
  data,
  setData,
}: UserArticleListProps) {
  if (!data) {
    return <p>投稿がありません。</p>;
  }

  const sortedPosts = (data ?? []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("記事を削除しますか？");
    if (!confirm) {
      return;
    }
    try {
      await deletePost({ id });
      setData(data.filter((data) => data.id !== id));
      toast("記事を削除しました");
    } catch (error) {
      console.error("記事削除処理中にエラーが発生しました:", error);
    }
  };

  return (
    <>
      <div className="wrapper">
        <h1 className="font-bold my-2">ユーザー投稿一覧</h1>
        <p>{data.length} 件</p>
      </div>
      <div className="overflow-x-auto md:overflow-hidden">
        <table className="min-w-[900px] divide-y divide-gray-200 mt-5 md:w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                タイトル
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                本文
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                画像
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                カテゴリー
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                編集
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                削除
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPosts ? (
              sortedPosts.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div>
                      <Link href={`/posts/${item.id}`}>{item.title}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{item.body.slice(0, 25)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    <Image
                      src={item.signedUrl}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="inline-block"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="mx-auto">
                      {item.categories.map((category, index) => (
                        <li className="text-xs font-semibold" key={index}>
                          {category.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    <Link href={`/posts/new/${item.id}`}>
                      <Button>編集</Button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    <Button mode="Danger" onClick={() => handleDelete(item.id)}>
                      削除
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <p>投稿を読み込んでいます...</p>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
