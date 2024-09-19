"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [status, setStatus] = useState<string>("0");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // モックユーザーのJWTトークンを取得
    const getMockUserToken = async () => {
      try {
        const response = await axios.post("http://localhost:3001/mockurl");
        const { token } = response.data;
        setToken(token);
      } catch (error) {
        console.error("モックユーザーのトークン取得に失敗しました", error);
      }
    };
    getMockUserToken();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("画像を選択してください");
      return;
    }

    try {
      // S3の署名付きURLを取得
      const signedUrlResponse = await axios.get(
        "http://localhost:3001/postsimage",
        {
          params: { filename: file.name },
          headers: {
            Authorization: `Bearer ${token}`, // モックユーザーのトークンを指定
          },
        }
      );
      const signedUrl = signedUrlResponse.data.signedUrl;

      // S3に画像をアップロード
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 記事情報をサーバーに送信
      const postResponse = await axios.post(
        "http://localhost:3001/posts",
        {
          post: {
            title,
            body,
            status,
            categoryIds,
            imageKey: file.name,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // モックユーザーのトークンを指定
          },
        }
      );

      alert("記事が投稿されました！");
      console.log("Post created:", postResponse.data.post);

      // 画像のダウンロード用署名付きURLを取得
      const imageUrlResponse = await axios.get("http://localhost:3001/posts", {
        params: { filename: file.name },
        headers: {
          Authorization: `Bearer ${token}`, // モックユーザーのトークンを指定
        },
      });
      console.log(imageUrlResponse);
      setImageUrl(imageUrlResponse.data.signedUrl);
    } catch (error) {
      console.error("投稿中にエラーが発生しました", error);
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-4">
      <div>
        <label>タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>本文</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>ステータス</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="0">下書き</option>
          <option value="1">公開</option>
        </select>
      </div>
      <div>
        <label>カテゴリ</label>
        <select
          multiple
          value={categoryIds.map(String)}
          onChange={(e) =>
            setCategoryIds(
              Array.from(e.target.selectedOptions).map((opt) =>
                Number(opt.value)
              )
            )
          }
          className="border rounded p-2 w-full"
        >
          <option value="1">プログラミング</option>
          <option value="2">キャリア</option>
          <option value="3">趣味</option>
        </select>
      </div>
      <div>
        <label>画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleSubmit}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        投稿する
      </button>
      {imageUrl && (
        <div>
          <h3>アップロードされた画像:</h3>
          <img src={imageUrl} alt="Uploaded" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default CreatePost;
