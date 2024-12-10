"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getMockUserToken, PostImg } from "../FetchData";
import { NewPost } from "@/types";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [status, setStatus] = useState<string>("0");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedToken = await getMockUserToken();
      if (!fetchedToken) {
        return;
      }
      setToken(fetchedToken);
    }
    fetchData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("画像を選択してください");
      return;
    }
    if (!token) {
      alert("tokenが取得できません");
      return;
    }

    const postData: NewPost = { title, body, status, categoryIds };
    const postImg = await PostImg(file, token, postData);
    if (postImg) {
      setImageUrl(postImg);
    } else {
      console.error("画像のアップロードまたは投稿に失敗しました");
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
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="0">下書き</option>
          <option value="1">公開</option>
        </select>
      </div>
      <div>
        <label>カテゴリ</label>
        <select
          multiple
          value={categoryIds.map(String)}
          onChange={(e) =>
            setCategoryIds(
              Array.from(e.target.selectedOptions).map((opt) =>
                Number(opt.value)
              )
            )
          }
          className="border rounded p-2 w-full"
        >
          <option value="1">プログラミング</option>
          <option value="2">キャリア</option>
          <option value="3">趣味</option>
        </select>
      </div>
      <div>
        <label>画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleSubmit}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        投稿する
      </button>
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
