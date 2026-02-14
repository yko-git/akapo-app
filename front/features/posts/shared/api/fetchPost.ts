import { fetchPost as fetchPostApi } from "@/shared/api/fetchData";

export const fetchPost = ({ id }: { id: number }) => {
  return fetchPostApi({ id });
};
