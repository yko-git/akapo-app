"use client";
import Link from "next/link";
import Image from "next/image";
import { Post, deletePost } from "@/api/fetchData";
import Button from "@/components/shared/button";

interface UserArticleListProps {
  data: Post[] | null;
  setData: any;
}

export default function UserArticleList({
  data,
  setData,
}: UserArticleListProps) {
  if (!data) {
    return <p>投稿がありません。</p>;
  }

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("記事を削除しますか？");
    if (!confirm) {
      return;
    }
    try {
      await deletePost({ id });
      setData(data.filter((data) => data.id !== id));
      alert("記事を削除しました。");
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
      <table className="border-collapse border border-slate-400 w-full mt-5">
        <thead>
          <tr>
            <th className="border border-slate-300 p-3">タイトル</th>
            <th className="border border-slate-300 p-3">本文</th>
            <th className="border border-slate-300 p-3">画像</th>
            <th className="border border-slate-300 p-3">カテゴリー</th>
            <th className="border border-slate-300 p-3">編集</th>
            <th className="border border-slate-300 p-3">削除</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((item, index) => (
              <tr key={index}>
                <td className="border border-slate-300 p-3">
                  <div>
                    <Link href={`/posts/${item.id}`}>{item.title}</Link>
                  </div>
                </td>
                <td className="border border-slate-300 p-3">
                  <div>{item.body.slice(0, 25)}</div>
                </td>
                <td className="border border-slate-300 p-3 text-center">
                  <Image
                    src={item.signedUrl}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="inline-block"
                  />
                </td>
                <td className="border border-slate-300 p-3 text-center">
                  <ul className="mx-auto">
                    {item.categories.map((category, index) => (
                      <li
                        className="text-xs inline-block text-white bg-[#6C9FE0] mr-2 px-3 py-1 text-[10px] font-semibold rounded-sm"
                        key={index}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-slate-300 p-3 text-center">
                  {/* <Button onClick={() => handlePatch(item.id)}>編集</Button> */}
                </td>
                <td className="border border-slate-300 p-3 text-center">
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
    </>
  );
}
