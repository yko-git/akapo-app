export interface User {
  id: number;
  name: string;
  iconUrl: string;
  iconSignedUrl: string;
}

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

export interface SelectBoxProps {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export interface TagListProps {
  Categories?: Array<{ name: string }>;
}

export interface PhotoProps {
  src: string;
  alt: string;
}

export interface NewUser {
  loginId: string;
  name: string;
  password: string;
}

export interface NewLogin {
  loginId: string;
  password: string;
}

export interface UserArticleListProps {
  data: Post[] | null;
}

export interface UserProfile {
  id: number;
  name: string;
  loginId: string;
  iconUrl?: string;
  iconSignedUrl?: string;
}
