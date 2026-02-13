"use client";
import React, { useState } from "react";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { NewUser } from "@/schemas/user.schema";
import { useUserForm } from "../hooks";
import { IMAGE_COMPRESSION_OPTIONS } from "@/constants/image";
import { validateImageFile } from "@/lib/validateImageFile";
import { createUser } from "../api";

const CreateUser = () => {
  const { register, handleSubmit, errors } = useUserForm();
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: NewUser) => {
    if (!validateImageFile(file)) return;

    try {
      setIsSubmitting(true);
      const compressedFile = await imageCompression(
        file!,
        IMAGE_COMPRESSION_OPTIONS,
      );
      await createUser(compressedFile, data);
      toast.success("ユーザー登録が完了しました。ログインしてください。");
      router.push("/login");
    } catch (error) {
      toast.error("投稿に失敗しました。時間をおいて再度お試しください。");
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
          {...register("loginId")}
          className="border rounded p-2 w-full mt-2"
          placeholder="本登録時に使用するIDです"
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
          {...register("password")}
          className="border rounded p-2 w-full mt-2"
          placeholder="本登録時に使用するパスワードです"
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
      {preview && (
        <div className="mt-4 text-center">
          <img
            src={preview}
            alt="画像プレビュー"
            className="w-32 h-32 object-cover rounded-full border inline-block mx-auto"
          />
        </div>
      )}

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
