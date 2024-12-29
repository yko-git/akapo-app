"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { patchPost, fetchPost, Post } from "@/api/fetchData";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";

const PatchPost = ({ id }: { id: number }) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<number[]>([1]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("0");
  const [data, setData] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const post = await fetchPost({ id });
        if (Array.isArray(post) && post.length > 0) {
          setData(post[0]);
          setTitle(post[0].title);
          setBody(post[0].body);
          setStatus(post[0].status);
          setCategoryIds(post[0].categories.map((cat: any) => cat.id));
          setImageUrl(post[0].signedUrl || null);
        }
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
      }
    }

    fetchData();
  }, [id]);

  const handleSelect = (value: string | string[]) => {
    if (typeof value === "string") {
      setStatus(value);
    }
  };

  const handleMultipleSelect = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setCategoryIds(value.map(Number));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("画像を選択してください");
      return;
    }

    const postData = { title, body, status, categoryIds };

    try {
      const postImg = await patchPost(id, file, postData);
      console.log(postImg);
      if (postImg) {
        setImageUrl(postImg);
      } else {
        console.error("画像のアップロードまたは投稿に失敗しました");
      }
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-4">
      <div>
        <label>タイトル</label>
        <input
          type="text"
          value={title}
          placeholder={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>本文</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>ステータス</label>
        <SelectBox
          options={statusList}
          value={status}
          onChange={handleSelect}
        />
      </div>
      <div>
        <label>カテゴリ</label>
        <SelectBox
          options={categories}
          multiple
          value={categoryIds.map(String)}
          onChange={handleMultipleSelect}
        />
      </div>
      <div>
        <label>画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <Button mode="Success" onClick={handleSubmit}>
        投稿する
      </Button>
      {imageUrl && (
        <div>
          <h3>アップロードされた画像:</h3>
          <Image src={imageUrl} alt="Uploaded" width={400} height={400} />
        </div>
      )}
    </div>
  );
};

export default PatchPost;
