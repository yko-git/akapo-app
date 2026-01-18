"use client";
import Link from "next/link";
import { deletePost } from "@/api/fetchData";
import Button from "@/components/shared/button";
import toast from "react-hot-toast";
import { usePostStore } from "@/stores/usePostStore";

export default function UserArticleList() {
  const { userPosts, removePost } = usePostStore();

  const sortedPosts = (userPosts ?? []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("記事を削除しますか？");
    if (!confirm) {
      return;
    }
    try {
      await deletePost({ id });
      removePost(id);
      toast("記事を削除しました");
    } catch (error) {
      console.error("記事削除処理中にエラーが発生しました:", error);
    }
  };

  if (!userPosts || userPosts.length === 0) {
    return <p>投稿がありません。</p>;
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="font-bold my-2">ユーザー投稿一覧</h1>
        <p>{userPosts.length} 件</p>
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
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div>
                      <Link href={`/posts/${item.id}`}>{item.title}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{item.body.slice(0, 25)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    <img
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
                  <td className="px-6 py-4 text-sm text-gray-500 text-center whitespace-nowrap">
                    <Link href={`/posts/new/${item.id}`}>
                      <Button
                        mode="Info"
                        className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
                      >
                        編集
                      </Button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center whitespace-nowrap">
                    <Button
                      mode="Danger"
                      onClick={() => handleDelete(item.id)}
                      className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
                    >
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
