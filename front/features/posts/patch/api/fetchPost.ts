import { fetchPost as fetchPostApi } from "@/api/fetchData";

export const fetchPost = ({ id }: { id: number }) => {
  return fetchPostApi({ id });
};
