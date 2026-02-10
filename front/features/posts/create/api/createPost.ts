import { createPost as createPostApi } from "@/api/fetchData";
import { NewPost } from "@/schemas/post.schema";

export const createPost = (file: File, data: NewPost) => {
  return createPostApi(file, data);
};
