import { createPost as createPostApi } from "@/shared/api/fetchData";
import { NewPost } from "@/shared/schemas";

export const createPost = (file: File, data: NewPost) => {
  return createPostApi(file, data);
};
