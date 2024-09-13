"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

const UploadImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [status, setStatus] = useState<string>("0");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    try {
      // 署名付きURLを取得
      const response = await axios.get(
        "http://localhost:3001/generate-upload-url",
        {
          params: { filename: file.name },
        }
      );
      const signedUrl = response.data.signedUrl;

      // S3にファイルをアップロード
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      alert("画像のアップロードが完了しました。");

      // アップロード後の画像を表示するためにURLを取得
      fetchImage(file.name);
    } catch (error) {
      console.error("画像のアップロードに失敗しました。", error);
    }
  };

  const fetchImage = async (filename: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/generate-download-url",
        {
          params: { filename },
        }
      );
      const signedUrl = response.data.signedUrl;

      setImageUrl(signedUrl);
    } catch (error) {
      console.error("画像の取得に失敗しました。", error);
    }
  };

  return (
    <>
      <div className="flex flex-col p-5 space-y-4">
        {/* <div>
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
        </div> */}

        <div>
          <label>画像</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          onClick={handleUpload}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-28"
        >
          投稿する
        </button>
      </div>

      {imageUrl && (
        <div className="mt-4">
          <p>アップロードされた画像:{imageUrl}</p>
          <Image
            src={imageUrl}
            alt="Uploaded Image"
            width={500}
            height={500}
            unoptimized
          />
        </div>
      )}
    </>
  );
};

export default UploadImage;
