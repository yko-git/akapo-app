import { uploadImage as uploadImageApi } from "@/shared/api/fetchData";

export const uploadImage = (file: File) => {
  return uploadImageApi(file);
};
