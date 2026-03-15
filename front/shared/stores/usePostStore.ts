import { create } from "zustand";
import { Post } from "../schemas";
import { devtools } from "zustand/middleware";

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

export const usePostStore = create<PostState>()(
  devtools(
    (set) => ({
      ...initialState,
      setPosts: (posts) => set({ posts }, false, "post/setPosts"),

      setCurrentPost: (post) =>
        set({ currentPost: post }, false, "post/setCurrentPost"),

      setUserPosts: (posts) =>
        set({ userPosts: posts }, false, "post/setUserPosts"),

      updatePost: (id, post) =>
        set(
          (state) => ({
            posts: state.posts.map((p) =>
              p.id === id
                ? {
                    ...post,
                    commentCount: p.commentCount,
                    hasNewComment: p.hasNewComment,
                  }
                : p,
            ),
            userPosts: state.userPosts.map((p) => (p.id === id ? post : p)),
            currentPost:
              state.currentPost?.id === id ? post : state.currentPost,
          }),
          false,
          "post/updatePost",
        ),

      removePost: (id) =>
        set(
          (state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            userPosts: state.userPosts.filter((p) => p.id !== id),
            currentPost:
              state.currentPost?.id === id ? null : state.currentPost,
          }),
          false,
          "post/removePost",
        ),

      setLoading: (loading) =>
        set({ isLoading: loading }, false, "post/setLoading"),

      setError: (error) => set({ error }, false, "post/setError"),

      reset: () => set(initialState, false, "post/reset"),
    }),
    { name: "PostStore" },
  ),
);
