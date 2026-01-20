"use client";
import React, { useState, useEffect } from "react";
import { patchPost, fetchPost, uploadImage } from "@/api/fetchData";
import { Post, NewPost } from "@/schemas/post.schema";
import { Category } from "@/schemas/post.schema";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PatchPost = ({ id }: { id: number }) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<number[]>([1]);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    async function fetchData() {
      try {
        const post = await fetchPost({ id });
        if (!post) {
          console.error("投稿が存在しません");
          return;
        }
        setTitle(post.title);
        setBody(post.body);
        setStatus(post.status.toString());
        setCategoryIds(post.categories.map((cat: Category) => cat.id));
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
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    const postData: NewPost = {
      title,
      body,
      status,
      categoryIds,
    };

    try {
      if (file) {
        // 新しい画像が選択されている場合のみ
        const newImageUrl = await uploadImage(file);
        // 新しい画像の `imageKey` を設定
        postData.imageKey = newImageUrl?.safeFilePath;
      }

      await patchPost(id, postData);
      toast.success("編集が完了しました");
      router.push("/mypage");
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6 mt-10">
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
      <Button
        mode="Success"
        onClick={handleSubmit}
        className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
      >
        投稿する
      </Button>
    </div>
  );
};

export default PatchPost;
