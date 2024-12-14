export interface User {
  id: number;
  name: string;
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
