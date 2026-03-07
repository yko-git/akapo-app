import { patchPost as patchPostApi } from "@/shared/api/fetchData";
import { NewPost } from "@/shared/schemas";

export const patchPost = (id: number, postData: NewPost) => {
  return patchPostApi(id, postData);
};
