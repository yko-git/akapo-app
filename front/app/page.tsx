"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

const UploadImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // バックエンドから署名付きURLを取得
      const response = await axios.get("http://localhost:3001/imgupload", {
        params: { filename: file.name },
      });

      const signedUrl = response.data.signedUrl;

      // 署名付きURLを使ってS3にファイルをアップロード
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const uploadedImageUrl = signedUrl.split("?")[0]; // 署名付きURLのクエリを除外
      setImageUrl(uploadedImageUrl);
      alert("画像がアップロードされました");
    } catch (err) {
      console.error("エラーが発生しました", err);
      alert("エラーが発生しました");
    }
  };

  return (
    <>
      <div className="flex p-5">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          upload
        </button>
      </div>
      {imageUrl && (
        <div>
          <p>{imageUrl}</p>
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
