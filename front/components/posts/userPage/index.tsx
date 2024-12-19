"use client";
import { user } from "@/api/fetchData";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import Image from "next/image";
import { fetchUserPosts } from "@/api/fetchData";
import UserArticleList from "../userArticleList";

const UserPage = () => {
  const [userData, setUserData] = useState<any | null>(null);
  const [data, setData] = useState<Post[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await user();
      setUserData(data);
      const posts = await fetchUserPosts();
      setData(posts);
    }

    fetchData();
  }, []);
  return (
    <div className="">
      {data ? (
        <>
          <div className="p-5">
            <div className="inline-block text-center">
              <Image
                className="inline-block mr-2"
                src={userData.iconUrl}
                alt=""
                width={100}
                height={100}
                loading="lazy"
              />
              <p className="text-[12px] mt-1">{userData.name}</p>
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
