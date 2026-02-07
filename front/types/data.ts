import { Post } from "@/schemas/post.schema";

export interface ArticleData<T> {
  data: T;
}

export interface StatusInfoProps {
  status: "loading" | "service-down" | "success" | "empty";
  data: Post | Post[] | null | undefined;
}
