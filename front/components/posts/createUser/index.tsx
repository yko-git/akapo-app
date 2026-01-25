"use client";
import React, { useState } from "react";
import { createUser } from "@/api/fetchData";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { useUserForm } from "@/hooks/useUserForm";
import { NewUser } from "@/schemas/user.schema";

const CreateUser = () => {
  const { register, handleSubmit, errors } = useUserForm();
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const onSubmit = async (data: NewUser) => {
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

    try {
      setIsSubmitting(true);
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      await createUser(compressedFile, data);
      toast.success("ユーザー登録が完了しました。ログインしてください。");
      router.push("/login");
    } catch (error) {
      console.error("登録処理中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6 mt-10"
    >
      <div>
        <label className="font-semibold text-lg tracking-widest">
          <h3 className="font-bold">ログインID</h3>
        </label>
        <input
          type="text"
          className="border rounded p-2 w-full mt-2"
          placeholder="本登録時に使用するIDです"
          {...register("loginId")}
        />
        {errors.loginId && (
          <p className="text-red-500 my-1 text-sm">{errors.loginId?.message}</p>
        )}
      </div>
      <div>
        <label className="font-semibold text-lg tracking-widest">
          <h3 className="font-bold">パスワード</h3>
        </label>
        <input
          type="password"
          className="border rounded p-2 w-full mt-2"
          placeholder="本登録時に使用するパスワードです"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 my-1 text-sm">
            {errors.password?.message}
          </p>
        )}
      </div>
      <div>
        <label className="font-semibold text-lg tracking-widest">
          <h3 className="font-bold">アカウント名</h3>
        </label>
        <input
          type="text"
          {...register("name")}
          className="border rounded p-2 w-full mt-2"
        />
        {errors.name && (
          <p className="text-red-500 my-1 text-sm">{errors.name?.message}</p>
        )}
      </div>
      <div>
        <label className="font-semibold text-lg tracking-widest">
          <h3 className="font-bold">アイコン画像</h3>
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <Button
        mode="Success"
        disabled={isSubmitting}
        className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
      >
        {isSubmitting ? "登録中..." : "登録する"}
      </Button>
      <p className="text-sm">
        画像サイズが大きい場合、登録完了まで時間がかかることがありますので、しばらくお待ちください。
      </p>
    </form>
  );
};

export default CreateUser;
