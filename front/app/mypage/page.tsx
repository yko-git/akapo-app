"use client";
import User from "@/components/posts/userPage";
import { LoginContext } from "@/components/shared/loginContext";
import { useContext } from "react";

export default function Mypage() {
  const isLoggedIn = useContext(LoginContext);
  return (
    <>
      <div className="m-4 wrapper">
        <h1 className="font-bold my-2">マイページ</h1>
        {isLoggedIn ? <p>ログインしています</p> : <p>ログインしていません</p>}
        <User />
      </div>
    </>
  );
}
