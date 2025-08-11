"use client";
import React, { useState } from "react";
import { createUser } from "@/api/fetchData";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const CreateUser = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("登録する");

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
    const userData = { loginId, name, password };

    try {
      const postImg = await createUser(compressedFile, userData);
      if (!postImg) {
        alert("画像のアップロードまたは投稿に失敗しました");
      }
      toast.success("ユーザー登録が完了しました。ログインしてください。");
      setSubmitMessage("ユーザー登録が完了しました");
      router.push("/login");
    } catch (error) {
      console.error("登録処理中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-4">
      <div>
        <label>
          <h3 className="font-bold">ログインID</h3>
        </label>
        <input
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>
          <h3 className="font-bold">アカウント名</h3>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>
          <h3 className="font-bold">アイコン画像</h3>
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <label>
          <h3 className="font-bold">パスワード</h3>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <Button mode="Success" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "登録中..." : submitMessage}
      </Button>
    </div>
  );
};

export default CreateUser;
