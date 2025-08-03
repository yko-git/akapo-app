"use client";
import { useEffect, useState } from "react";
import { Post, UserProfile } from "@/api/fetchData";
import Image from "next/image";
import { fetchUserPosts, fetchUserData } from "@/api/fetchData";
import UserArticleList from "../userArticleList";
import Link from "next/link";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";

const UserPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [data, setData] = useState<Post[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await fetchUserData();
        setUserProfile(userData);

        const posts = await fetchUserPosts();
        setData(posts);
      } catch (error) {
        console.error("データ取得中にエラー:", error);
      }
    }

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="">
      {userProfile ? (
        <>
          <div className="p-5 text-center">
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
        <p>ユーザー情報を読み込んでいます...</p>
      )}
      <div className="mt-8 text-right">
        <Button onClick={handleLogout}>ログアウト</Button>
      </div>
      <div className="mt-8">
        <UserArticleList data={data} setData={setData} />
      </div>
      <div className="mt-10 text-right">
        <Link href="/posts/new">
          <Button>新しい投稿を作成</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
