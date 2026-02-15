import { create } from "zustand";
import { Post } from "@/schemas/post.schema";

// コメント情報を含む拡張Post型
export type PostWithComments = Post & {
  commentCount: number;
  hasNewComment: boolean;
};

interface PostState {
  // データ
  posts: PostWithComments[];
  currentPost: Post | null;
  userPosts: Post[];

  // 状態管理
  isLoading: boolean;
  error: string | null;

  // アクション
  setPosts: (posts: PostWithComments[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setUserPosts: (posts: Post[]) => void;
  updatePost: (id: number, post: Post) => void;
  removePost: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// 初期値
const initialState = {
  posts: [],
  currentPost: null,
  userPosts: [],
  isLoading: false,
  error: null,
};

export const usePostStore = create<PostState>((set) => ({
  ...initialState,
  setPosts: (posts) => set({ posts }),

  setCurrentPost: (post) => set({ currentPost: post }),

  setUserPosts: (posts) => set({ userPosts: posts }),

  updatePost: (id, post) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id
          ? {
              ...post,
              commentCount: p.commentCount,
              hasNewComment: p.hasNewComment,
            }
          : p
      ),
      userPosts: state.userPosts.map((p) => (p.id === id ? post : p)),
      currentPost: state.currentPost?.id === id ? post : state.currentPost,
    })),

  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      userPosts: state.userPosts.filter((p) => p.id !== id),
      currentPost: state.currentPost?.id === id ? null : state.currentPost,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
