"use client";
import { useEffect, useState } from "react";
import { Post } from "@/components/posts/models/post";
import Image from "next/image";
import { fetchUserPosts, fetchUserData } from "@/api/fetchData";
import UserArticleList from "../userArticleList";

const UserPage = () => {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [data, setData] = useState<Post[] | null>(null);

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
  return (
    <div className="">
      {userProfile ? (
        <>
          <div className="p-5">
            <div className="inline-block text-center">
              <Image
                className="inline-block mr-2 rounded-full object-cover w-[90px] h-[90px] border-[#6C9FE0] border-4"
                src={userProfile.iconSignedUrl}
                alt=""
                width={100}
                height={100}
                loading="lazy"
              />
              <p className="text-[12px] mt-1">{userProfile.name}</p>
            </div>
          </div>
        </>
      ) : (
        <p>ユーザー情報を読み込んでいます...</p>
      )}
      <div className="mt-8">
        <UserArticleList data={data} />
      </div>
    </div>
  );
};

export default UserPage;
