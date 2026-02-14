import { patchPost as patchPostApi } from "@/shared/api/fetchData";
import { NewPost } from "@/schemas/post.schema";

export const patchPost = (id: number, postData: NewPost) => {
  return patchPostApi(id, postData);
};
