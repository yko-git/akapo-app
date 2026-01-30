// API関連の設定値
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const API_TIMEOUT = 30000; // タイムアウト時間（ミリ秒）

// APIエンドポイント
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  USER: "/user",
  USERPOSTS: "/user/posts",
  POSTS: "/posts",
  COMMENTS: "/comments",
  SIGNEDURL: "/signedurl",
} as const;
