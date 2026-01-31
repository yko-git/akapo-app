import {
  ALLOWED_IMAGE_TYPES,
  FILE_SIZE_BYTES_TO_MB,
  MAX_FILE_SIZE_MB,
} from "@/constants/image";
import toast from "react-hot-toast";

export const validateImageFile = (
  file: File | null,
  required: boolean = true
): boolean => {
  if (!file) {
    if (required) {
      toast.error("画像を選択してください");
      return false;
    }
    return true;
  }
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    toast.error("PNG/JPEG/WEBP/SVG以外のファイル形式はご遠慮ください");
    return false; // ここで処理終了
  }

  const sizeMB = file.size / FILE_SIZE_BYTES_TO_MB;
  if (sizeMB > MAX_FILE_SIZE_MB) {
    toast.error(`ファイルサイズは${MAX_FILE_SIZE_MB}MB以下でお願いいたします`);
    return false;
  }
  return true;
};
