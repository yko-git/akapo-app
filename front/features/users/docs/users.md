# Feature名

users

![feature](../../../docs/screens/users.png)

## Feature概要

ログインユーザー向けのマイページ Feature。ユーザープロファイル情報・アイコン画像の表示、自分の投稿一覧の表示、ログアウト、新規投稿作成への導線を提供する。認証チェックを行い、未ログインの場合は `/login` へリダイレクトする。

## 主要な責務

- 認証チェック（`useRequireAuth`）により未ログインユーザーを `/login` にリダイレクト
- マウント時にユーザープロファイルと自分の投稿一覧を API から取得し Store に保存
- ユーザーアイコン・アカウント名の表示
- ログアウト処理（Store のクリアと `/login` へのリダイレクト）
- 新規投稿作成ページ（`/posts/new`）への導線
- 自分の投稿一覧（`UserPostListPage`）の表示

## 提供するコンポーネント

| コンポーネント | 説明 |
|---|---|
| `UsersPage` | マイページのルートコンポーネント。`User` を内包 |
| `User` | マイページのメインコンポーネント。データ取得・表示・ログアウトを担う |

## 提供するHooks

なし（`useRequireAuth` は `posts/shared/hooks` から利用）

## 状態管理（Store）

| Store | 使用箇所 | 操作 |
|---|---|---|
| `useAuthStore` | `User` | `userProfile` 参照、`setUserProfile` でプロフィール保存、`logout` でログアウト |
| `usePostStore` | `User` | `setUserPosts` で投稿一覧保存、`isLoading`・`error`・`setLoading`・`setError` で状態管理 |

## 使用している外部依存

| 依存 | 用途 |
|---|---|
| `next/navigation` (`useRouter`) | ログアウト後 `/login` へリダイレクト |
| `next/link` (`Link`) | `/posts/new` への導線 |
| `next/image` (`Image`) | ユーザーアイコン表示 |
| `@/shared/components/statusInfo` (`StatusInfo`) | ローディング・エラー状態の表示 |
| `@/shared/components/font` (`jost`) | タイトルフォント |
| `@/shared/components/button` (`Button`) | ログアウト・新規投稿ボタン |
| `@/shared/stores` (`usePostStore`, `useAuthStore`) | 投稿・認証状態管理 |
| `@/features/posts/user-list/UserPostListPage` | 自分の投稿一覧コンポーネント |
| `@/features/posts/shared/hooks` (`useRequireAuth`) | 認証チェック Hook |
| `@/shared/lib/getErrorMessage` | エラーメッセージ変換 |

## 使用されている箇所（routes）

| ルート | 説明 |
|---|---|
| `/mypage` | `UsersPage` が表示される |

## 補足・制約

- `userProfile` が Store に存在する場合は API 取得をスキップし Store の値を使用する
- `isLoading` 中は `StatusInfo status="loading"` を、`error` 時は `StatusInfo status="service-down"` を表示
- `useRequireAuth` の返す `isAuthChecked` が `false` の間はデータ取得を行わない

<!-- META -->
Feature ID: users
最終更新日: 2026-04-11
<!-- /META -->

# 実装コード

### mypage/UsersPage.tsx

```tsx
import User from "./components/User";

export default function UsersPage() {
  return (
    <>
      <div className="m-4 md:mt-4 md:mx-auto md:mb-20">
        <User />
      </div>
    </>
  );
}
```

### mypage/api/fetchUserData.ts

```ts
import { fetchUserData as fetchUserDataApi } from "@/shared/api/fetchData";
import { UserProfile } from "@/shared/types";

export const fetchUserData = (): Promise<UserProfile | null> => {
  return fetchUserDataApi();
};
```

### mypage/api/fetchUserPosts.ts

```ts
import { fetchUserPosts as fetchUserPostsApi } from "@/shared/api/fetchData";
import { Post } from "@/shared/types";

export const fetchUserPosts = (): Promise<Post[] | null> => {
  return fetchUserPostsApi();
};
```
