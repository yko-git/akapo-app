"use client";
import React, { useState } from "react";
import Button from "@/components/shared/button";
import { createLogin, fetchUserData } from "@/api/fetchData";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoginForm } from "@/hooks/useLoginForm";
import { NewLogin } from "@/schemas/user.schema";

const LoginUser = () => {
  const { register, handleSubmit, errors } = useLoginForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { setUserProfile } = useAuthStore();

  const onSubmit = async (data: NewLogin) => {
    try {
      setIsSubmitting(true);
      const token = await createLogin(data);
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 mt-10"
        id="loginForm"
      >
        <div>
          <label className="font-semibold text-lg tracking-widest">
            ログインID
          </label>
          <input
            type="text"
            {...register("loginId")}
            className="border rounded p-2 w-full mt-2"
          />
          {errors.loginId && (
            <p className="text-red-500 my-1 text-sm">
              {errors.loginId?.message}
            </p>
          )}
        </div>
        <div>
          <label className="font-semibold text-lg tracking-widest">
            パスワード
          </label>
          <input
            type="password"
            {...register("password")}
            className="border rounded p-2 w-full mt-2"
          />
          {errors.password && (
            <p className="text-red-500 my-1 text-sm">
              {errors.password?.message}
            </p>
          )}
        </div>
        <div id="loginSubmit" className="text-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
          >
            {isSubmitting ? "ログイン中です..." : "ログイン"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginUser;
