"use client";
import React, { useState, useEffect } from "react";
import { patchPost, fetchPost, uploadImage } from "@/api/fetchData";
import { NewPost } from "@/schemas/post.schema";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StatusInfo from "@/components/shared/statusInfo";
import { usePostForm } from "@/hooks/usePostForm";
import imageCompression from "browser-image-compression";
import { Controller } from "react-hook-form";

const PatchPost = ({ id }: { id: number }) => {
  const { register, handleSubmit, control, errors, reset } = usePostForm();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError("");
        const post = await fetchPost({ id });
        if (!post) {
          setError("投稿が見つかりません");
          return;
        }
        reset({
          title: post.title,
          body: post.body,
          status: post.status.toString(),
          categoryIds: post.categories.map((cat) => cat.id),
        });
      } catch (error) {
        setError("投稿の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, reset]);

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
    // 新しいファイルが選択されている場合のみバリデーション
    if (file) {
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
    }
    try {
      // 画像を圧縮
      setIsSubmitting(true);
      if (file) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const newImageUrl = await uploadImage(compressedFile);
        data.imageKey = newImageUrl?.safeFilePath;
      }

      await patchPost(id, data);
      toast.success("投稿が完了しました");
      router.push("/mypage");
    } catch (error) {
      toast.error("投稿に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) return <StatusInfo status="loading" data={null} />;
  if (error) return <StatusInfo status="service-down" data={null} />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6 mt-10"
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
        <label>ステータス</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectBox
              options={statusList}
              value={field.value}
              onChange={(value) => {
                if (typeof value === "string") {
                  field.onChange(value);
                }
              }}
            />
          )}
        />
      </div>
      <div>
        <label>カテゴリ</label>
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => (
            <SelectBox
              multiple
              options={categories}
              value={field.value?.map(String) || []}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  field.onChange(value.map(Number));
                }
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
        {isSubmitting ? "投稿送信中..." : "投稿を編集する"}
      </Button>
    </form>
  );
};

export default PatchPost;
