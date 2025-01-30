"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  patchPost,
  fetchPost,
  Post,
  NewPost,
  uploadImage,
} from "@/api/fetchData";
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
          const data = post[0];
          setData(data);
          setTitle(data.title);
          setBody(data.body);
          setFile(data.imageKey ?? null);
          setStatus(data.status.toString());
          setCategoryIds(data.categories.map((cat: any) => cat.id));
          setImageUrl(data.signedUrl || null);
        } else {
          console.error("データが見つかりませんでした");
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
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file && !imageUrl) {
      alert("画像を選択してください");
      return;
    }

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
      } else if (imageUrl && data?.imageKey) {
        // 既存の画像URLがあり、imageKeyがあればそれを使用
        postData.imageKey = data.imageKey;
      }

      const existingImageUrl = await patchPost(id, postData);
      setImageUrl(existingImageUrl);
      alert("編集が完了しました");
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
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={100}
            height={100}
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

export default PatchPost;
