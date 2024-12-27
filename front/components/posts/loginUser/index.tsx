"use client";
import React, { useState } from "react";
import Button from "@/components/shared/button";
import { createLogin } from "@/api/fetchData";
import { useRouter } from "next/navigation";

const LoginUser = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    const postData = { loginId, password };
    try {
      const token = await createLogin(postData);

      if (token) {
        alert("ログインに成功しました！");
        router.push("/mypage");
      }
    } catch (error) {
      console.error("ログイン処理でエラーが発生しました", error);
      alert("ログインに失敗しました");
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
        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <Button onClick={handleSubmit}>投稿する</Button>
    </div>
  );
};

export default LoginUser;
