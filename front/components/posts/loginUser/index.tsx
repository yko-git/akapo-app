"use client";
import React, { useState } from "react";
import Button from "@/components/shared/button";
import { createLogin, fetchUserData } from "@/api/fetchData";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";

const LoginUser = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { setUserProfile } = useAuthStore();

  const handleSubmit = async () => {
    const postData = { loginId, password };

    try {
      setIsSubmitting(true);
      const token = await createLogin(postData);
      if (!token) {
        toast.error("ログインに失敗しました");
        return;
      }

      const userData = await fetchUserData();
      setUserProfile(userData);
      toast.success(`ようこそ ${userData?.name} さん`);
      router.push("/mypage");
    } catch (error) {
      toast.error("ログインに失敗しました");
      console.error("ログイン処理でエラーが発生しました", error);
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
            className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginUser;
