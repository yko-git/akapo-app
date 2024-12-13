"use client";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import { fetchPostById, getMockUserToken } from "@/api/fetchData";
import Image from "next/image";

export default function Article({ id }: { id: number }) {
  const [data, setData] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = await getMockUserToken();
      if (!token) return;

      const post = await fetchPostById(id, token);
      setData(post);
    }

    fetchData();
  }, [id]);

  // データが取得できていない場合の表示
  if (!data) {
    return <p className="text-center">読み込み中・・・</p>;
  }

  return (
    <>
      <div>{data.User.name}</div>
      <h1 className="font-bold my-2">{data.title}</h1>
      <div>{new Date(data.createdAt).toLocaleString()}</div>
      <div>{data.Categories.map((value) => value.name).join(", ")}</div>
      <div className="mt-4">
        <Image src={data.signedUrl} alt={data.title} width={400} height={300} />
      </div>
      <div>
        {data.body.split("\n").map((item: string, index: number) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </>
  );
}
