import { create } from "zustand";
import { Comment } from "@/shared/schemas";

interface CommentState {
  // 現在の投稿のコメントだけ管理
  comments: Comment[];

  // 状態管理
  isLoading: boolean;
  error: string | null;

  // アクション
  setComments: (comments: Comment[]) => void; // コメント一覧を設定
  addComment: (comment: Comment) => void; // コメントを追加
  removeComment: (id: number) => void; // コメントを削除
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// 初期値
const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const useCommentStore = create<CommentState>((set) => ({
  ...initialState,
  setComments: (comments) => set({ comments }),

  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),

  removeComment: (id) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
