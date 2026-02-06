以下は、提示された既存の画面仕様書に基づいて、実装コードの変更点を反映して更新したものです。

## 更新後の画面仕様書

# マイページ

## 画面概要
このページは、ユーザーの情報と投稿一覧を表示するマイページです。ログアウト機能と新しい投稿の作成が可能です。

## URL
- `/mypage`

## 使用コンポーネント
- `UserPage`
  - `UserArticleList`
  - `Button`
  - `StatusInfo`
  - `Image`

## フォーム項目・表示要素
- ユーザーのアイコン画像
- ユーザー名
- ログアウトボタン
- 新しい投稿を作成するためのボタン
- ユーザーの投稿一覧

## 初期表示・デフォルト値
- ユーザー情報の取得中は「ユーザー情報を読み込んでいます...」と表示される
- ユーザー情報が取得できた後、ユーザーのアイコン画像とユーザー名が表示される

## ユーザー操作
- ログアウトボタンをクリックすると、ログアウトし、ログインページ(`/login`)にリダイレクトされる
- 「新しい投稿を作成する」ボタンをクリックすると、投稿作成ページ(`/posts/new`)に遷移する

## API連携
- `fetchUserData`: ユーザー情報を取得するAPI
- `fetchUserPosts`: ユーザーの投稿一覧を取得するAPI

## バリデーション・エラーハンドリング
- ユーザー情報の取得中は `StatusInfo` コンポーネントで `loading` 状態を表示する
- ユーザー情報の取得でエラーが発生した場合は `StatusInfo` コンポーネントで `service-down` 状態を表示する

## 補足・制約
- ユーザーがログインしていない状態では、このページにアクセスできない
- コード上では、ログアウト処理の詳細は不明

## 実装コード（変更後）
// ===== components/posts/userPage/index.tsx =====
"use client";
import { useEffect } from "react";
import { fetchUserPosts, fetchUserData } from "@/api/fetchData";
import UserArticleList from "../userArticleList";
import Link from "next/link";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";
import StatusInfo from "@/components/shared/statusInfo";
import { jost } from "@/components/shared/font";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { usePostStore } from "@/stores/usePostStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";

const UserPage = () => {
  const { userProfile, setUserProfile, logout } = useAuthStore();
  const { setUserPosts, isLoading, error, setLoading, setError } =
    usePostStore();
  const router = useRouter();
  const isAuthChecked = useRequireAuth();

  useEffect(() => {
    if (!isAuthChecked) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        if (!userProfile) {
          const userData = await fetchUserData();
          setUserProfile(userData);
        }

        const posts = await fetchUserPosts();
        if (posts) {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("投稿の取得でエラーが発生しました:", error);
        setError(
          error instanceof Error ? error.message : "投稿の取得に失敗しました",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [
    isAuthChecked,
    userProfile,
    setUserProfile,
    setUserPosts,
    setLoading,
    setError,
  ]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) return <StatusInfo status="loading" data={null} />;
  if (error) return <StatusInfo status="service-down" data={null} />;

  return (
    <div className="wrapper">
      <div className="text-center">
        <h3
          className={`${jost.className} md:text-[53px] text-[22px] text-[#6C9FE0] tracking-[.2rem] font-bold`}
        >
          Mypage
        </h3>
      </div>
      {userProfile ? (
        <>
          <div className="p-5 text-center mt-8">
            <div className="inline-block text-center">
              <Image
                className="inline-block mr-2 rounded-full object-cover w-[140px] h-[140px] border-[#6C9FE0] border-4"
                src={userProfile.iconSignedUrl}
                alt=""
                width={100}
                height={100}
                loading="lazy"
              />
              <p className="text-base font-bold mt-1">{userProfile.name}</p>
            </div>
          </div>
        </>
      ) : (
        <p>ユーザー情報を読み込み中です...</p>
      )}
      <div className="mt-8 md:text-right text-center">
        <Button
          mode="Danger"
          onClick={handleLogout}
          className="py-5 px-10 text-white text-sm font-semibold tracking-widest rounded-lg"
        >
          ログアウトする
        </Button>
      </div>
      <div className="mt-10 text-center">
        <Link href="/posts/new">
          <Button
            mode="Info"
            className="py-5 px-10 text-white text-sm font-semibold tracking-widest rounded-lg"
          >
            新しい投稿を作成する
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        <UserArticleList />
      </div>
    </div>
  );
};

export default UserPage;

// ===== app/mypage/page.tsx =====
"use client";
import User from "@/components/posts/userPage";

export default function Mypage() {
  return (
    <>
      <div className="m-4 md:mt-4 md:mx-auto md:mb-20">
        <User />
      </div>
    </>
  );
}

# 更新ルール
- 変更がない記述は残す
- 変更・追加された仕様のみを更新する
- 削除された挙動があれば反映する
- 不明な点は「コード上では不明」と明記する