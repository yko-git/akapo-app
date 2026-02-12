import { uploadImage as uploadImageApi } from "@/api/fetchData";

export const uploadImage = (file: File) => {
  return uploadImageApi(file);
};
