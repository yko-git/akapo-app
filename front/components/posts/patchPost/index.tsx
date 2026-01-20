"use client";
import React, { useState, useEffect } from "react";
import { patchPost, fetchPost, uploadImage } from "@/api/fetchData";
import { NewPost } from "@/schemas/post.schema";
import { Category } from "@/schemas/post.schema";
import Button from "@/components/shared/button";
import SelectBox from "@/components/shared/selectBox";
import { statusList, categories } from "@/components/shared/data";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StatusInfo from "@/components/shared/statusInfo";

const PatchPost = ({ id }: { id: number }) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<number[]>([1]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const post = await fetchPost({ id });
        if (!post) {
          console.error("投稿が存在しません");
          return;
        }
        setTitle(post.title);
        setBody(post.body);
        setStatus(post.status.toString());
        setCategoryIds(post.categories.map((cat: Category) => cat.id));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "投稿の取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

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
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
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
      setIsSubmitting(true);

      const postData: NewPost = {
        title,
        body,
        status,
        categoryIds,
      };

      if (file) {
        // 新しい画像が選択されている場合のみ
        const newImageUrl = await uploadImage(file);
        // 新しい画像の `imageKey` を設定
        postData.imageKey = newImageUrl?.safeFilePath;
      }

      await patchPost(id, postData);
      toast.success("編集が完了しました");
      router.push("/mypage");
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
      toast.error("投稿の編集に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) return <StatusInfo status="loading" data={null} />;
  if (error) return <StatusInfo status="service-down" data={null} />;

  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div>
        <label>タイトル</label>
        <input
          type="text"
          value={title}
          placeholder={title}
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
        {isSubmitting ? "投稿送信中..." : "投稿を編集する"}
      </Button>
    </div>
  );
};

export default PatchPost;
