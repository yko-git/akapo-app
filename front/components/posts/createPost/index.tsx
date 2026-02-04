"use client";
import React, { useState } from "react";
import { createPost } from "@/api/fetchData";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";
import toast from "react-hot-toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import { usePostForm } from "@/hooks/usePostForm";
import { NewPost } from "@/schemas/post.schema";
import { Controller } from "react-hook-form";
import imageCompression from "browser-image-compression";
import { IMAGE_COMPRESSION_OPTIONS } from "@/constants/image";
import { validateImageFile } from "@/lib/validateImageFile";

const CreatePost = () => {
  const { register, handleSubmit, control, errors } = usePostForm();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const checked = useRequireAuth();
  const router = useRouter();

  // 認証チェック完了前は何も表示しない
  if (!checked) return null;

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

  const onSubmit = async (data: NewPost) => {
    if (!validateImageFile(file)) return;

    try {
      // 画像を圧縮
      setIsSubmitting(true);
      const compressedFile = await imageCompression(
        file!,
        IMAGE_COMPRESSION_OPTIONS
      );
      await createPost(compressedFile, data);
      toast.success("投稿が完了しました");
      router.push("/mypage");
    } catch (error) {
      toast.error("投稿に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      className="flex flex-col space-y-6 mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label>タイトル</label>
        <input
          type="text"
          {...register("title")}
          className="border rounded p-2 w-full"
        />
        {errors.title && (
          <p className="text-red-500 my-1 text-sm">{errors.title?.message}</p>
        )}
      </div>
      <div>
        <label>本文</label>
        <textarea {...register("body")} className="border rounded p-2 w-full" />
        {errors.body && (
          <p className="text-red-500 my-1 text-sm">{errors.body?.message}</p>
        )}
      </div>
      <div>
        <label>下書き用/本番反映</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectBox
              options={statusList}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </div>
      <div>
        <label>カテゴリー</label>
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => (
            <SelectBox
              options={categories}
              multiple
              value={(field.value ?? []).map(String)}
              onChange={(value) => {
                const ids = Array.isArray(value)
                  ? value.map(Number)
                  : [Number(value)];

                field.onChange(ids);
              }}
            />
          )}
        />
      </div>

      <div>
        <label>画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {preview && (
        <div className="mt-4 text-center">
          <img
            src={preview}
            alt="画像プレビュー"
            className="w-32 h-32 object-cover inline-block mx-auto"
          />
        </div>
      )}
      <Button
        mode="Success"
        disabled={isSubmitting}
        className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
      >
        {isSubmitting ? "投稿送信中..." : "投稿する"}
      </Button>
      <p className="text-sm">
        画像サイズが大きい場合、投稿完了まで時間がかかることがありますので、しばらくお待ちください。
      </p>
    </form>
  );
};

export default CreatePost;
