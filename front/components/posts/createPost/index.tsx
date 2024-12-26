"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getUserToken, createPost } from "@/api/fetchData";
import { NewPost } from "@/types";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<number[]>([1]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    async function fetchData() {
      const fetchedToken = await getUserToken();
      if (!fetchedToken) {
        return;
      }
      setToken(fetchedToken);
    }
    fetchData();
  }, []);

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

    const postData: NewPost = { title, body, status, categoryIds };
    try {
      const postImg = await createPost(file, postData);
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
      <Button onClick={handleSubmit}>投稿する</Button>
      {imageUrl && (
        <div>
          <h3>アップロードされた画像:</h3>
          <Image src={imageUrl} alt="Uploaded" width={400} height={400} />
        </div>
      )}
    </div>
  );
};

export default CreatePost;
