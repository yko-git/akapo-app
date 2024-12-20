"use client";
import { user } from "@/api/fetchData";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import Image from "next/image";
import { fetchUserPosts } from "@/api/fetchData";
import UserArticleList from "../userArticleList";

const UserPage = () => {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [data, setData] = useState<Post[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const userData = await user();
      console.log({ userData });
      setUserProfile(userData);
      const posts = await fetchUserPosts();
      setData(posts);
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
                className="inline-block mr-2"
                src={userProfile.signedUserUrl}
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
