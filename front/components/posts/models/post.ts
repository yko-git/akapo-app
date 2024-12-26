import { User } from "./user";

export interface Post {
  id: number;
  title: string;
  body: string;
  signedUrl: string;
  createdAt: string;
  Categories: { id: number; name: string }[];
  User: User;
}

export interface NewPost {
  title: string;
  body: string;
  status: string;
  categoryIds: number[];
}

export interface UserArticleListProps {
  data: Post[] | null;
}
