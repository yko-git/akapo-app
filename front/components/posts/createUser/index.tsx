"use client";
import React, { useState } from "react";
import { createUser } from "@/api/fetchData";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";

const CreateUser = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("画像を選択してください");
      return;
    }

    const userData = { loginId, name, password };
    try {
      const postImg = await createUser(file, userData);
      if (!postImg) {
        alert("画像のアップロードまたは投稿に失敗しました");
      }
      alert("ユーザー登録が完了しました。ログインしてください。");
      router.push("/login");
    } catch (error) {
      console.error("登録処理中にエラーが発生しました:", error);
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
    </div>
  );
};

export default CreateUser;
