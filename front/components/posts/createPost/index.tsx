"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPost } from "@/api/fetchData";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<number[]>([1]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("投稿する");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleSelect = (value: string | string[]) => {
    if (typeof value === "string") {
      setStatus(value);
    }
  };

  const handleMultipleSelect = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setCategoryIds(value.map(Number));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };
  const handleSubmit = async () => {
    if (!file) {
      toast.error("画像を選択してください");
      return;
    }

    // 許可するMIMEタイプ
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("PNG/JPEG/WEBP/SVG以外のファイル形式はご遠慮ください");
      return; // ここで処理終了
    }

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > 5) {
      toast.error("ファイルサイズは5MB以下でお願いいたします");
      return;
    }

    // 画像を圧縮
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 };
    const compressedFile = await imageCompression(file, options);

    setIsSubmitting(true);
    const postData = { title, body, status, categoryIds };
    try {
      const postImg = await createPost(compressedFile, postData);
      if (postImg) {
        setImageUrl(postImg);
        toast.success("投稿が完了しました");
        setSubmitMessage("投稿が完了しました");
      } else {
        toast.error("画像のアップロードまたは投稿に失敗しました");
        setSubmitMessage("投稿に失敗しました");
      }
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 mt-10">
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
        <SelectBox
          options={statusList}
          value={status}
          onChange={handleSelect}
        />
      </div>
      <div>
        <label>カテゴリ</label>
        <SelectBox
          options={categories}
          multiple
          value={categoryIds.map(String)}
          onChange={handleMultipleSelect}
        />
      </div>
      <div>
        <label>画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <Button
        mode="Success"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
      >
        {isSubmitting ? "投稿送信中..." : submitMessage}
      </Button>
      {imageUrl && (
        <div>
          <h3>アップロードされた画像:</h3>
          <img src={imageUrl} alt="Uploaded" width={100} height={100} />
        </div>
      )}
    </div>
  );
};

export default CreatePost;
