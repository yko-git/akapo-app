"use client";
import React, { useState } from "react";
import Button from "@/components/shared/button";
import { createLogin, fetchUserData } from "@/api/fetchData";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginUser = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const postData = { loginId, password };

    try {
      const token = await createLogin(postData);
      if (!token) {
        toast.error("ログインに失敗しました");
        return;
      }

      const userData = await fetchUserData();
      toast.success(`ようこそ ${userData?.name} さん`);
      router.push("/mypage");
    } catch (error) {
      toast.error("ログインに失敗しました");
      console.error("ログイン処理でエラーが発生しました", error);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-6 mt-10" id="loginForm">
        <div>
          <label className="font-semibold text-lg tracking-widest">
            ログインID
          </label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="border rounded p-2 w-full mt-2"
            name="loginId"
          />
        </div>
        <div>
          <label className="font-semibold text-lg tracking-widest">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full mt-2"
            name="password"
          />
        </div>
        <div id="loginSubmit" className="text-center">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
          >
            ログインする
          </Button>
        </div>
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
