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
