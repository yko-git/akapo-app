// API関連の設定値
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const API_TIMEOUT = 30000; // タイムアウト時間（ミリ秒）

// APIエンドポイント
export const API_ENDPOINTS = {
  // 認証
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  // ユーザー
  USER: "/user",
  USERPOSTS: "/user/posts",
  // 投稿
  POSTS: "/posts",
  // コメント
  COMMENTS: "/comments",
  // その他
  SIGNEDURL: "/signedurl",
} as const;
