import { Post } from "@/shared/schemas";
import { STATUS_INFO } from "../constants/status";

export interface ArticleData<T> {
  data: T;
}

// UI状態の型
export type Status = (typeof STATUS_INFO)[number];

export interface StatusInfoProps {
  status: Status;
}
