"use client";
import React, { useState } from "react";
import Image from "next/image";
import { createUser } from "@/api/fetchData";
import { NewUser } from "@/types";
import Button from "@/components/shared/button";

const CreateUser = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("画像を選択してください");
      return;
    }

    const userData: NewUser = { loginId, name, password };
    try {
      const postImg = await createUser(file, userData);
      if (postImg) {
        setImageUrl(postImg);
      } else {
        alert("画像のアップロードまたは投稿に失敗しました");
      }
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-4">
      <div>
        <label>ログインID</label>
        <input
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>アイコン画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <Button onClick={handleSubmit}>登録する</Button>
      {imageUrl && (
        <div>
          <h3>アップロードされた画像:</h3>
          <Image src={imageUrl} alt="Uploaded" width={100} height={100} />
        </div>
      )}
    </div>
  );
};

export default CreateUser;
