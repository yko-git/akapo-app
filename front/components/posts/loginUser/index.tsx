"use client";
import React, { useState } from "react";
import Button from "@/components/shared/button";
import { createLogin } from "@/api/fetchData";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/api/fetchData";
import toast from "react-hot-toast";

const LoginUser = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    const postData = { loginId, password };
    try {
      const token = await createLogin(postData);
      const userData = await fetchUserData();
      if (!token) {
        alert("ログインに失敗しました");
        return;
      }
      toast.success(`ようこそ ${userData?.name} さん`);
      router.push("/mypage");
    } catch (error) {
      toast.error("ログインに失敗しました");
      console.error("ログイン処理でエラーが発生しました", error);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4" id="loginForm">
        <div>
          <label>ログインID</label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="border rounded p-2 w-full"
            name="loginId"
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            name="password"
          />
        </div>
        <Button type="submit" onClick={handleSubmit}>
          ログインする
        </Button>
      </div>
      <div className="mt-5 border-l-2 pl-4 leading-loose">
        現在機能開発中のため、
        <br />
        ログインID：<strong>test</strong>
        <br />
        パスワード：<strong>test</strong>で仮ログイン可能です。
      </div>
    </>
  );
};

export default LoginUser;
