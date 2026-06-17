

# users

![feature](../../../docs/screens/users.png)

## Feature概要

ログイン済みユーザーのマイページ機能を提供するFeature。ユーザープロフィール情報（アイコン・名前）の表示、ログアウト操作、新規投稿作成への導線、およびユーザー自身の投稿一覧表示を1画面に集約している。

## 主要な責務

| 責務 | 説明 |
|------|------|
| 認証チェック | `useRequireAuth` フックにより、未認証ユーザーのアクセスを制御する |
| ユーザープロフィール取得・表示 | ユーザーデータをAPIから取得し、アイコン画像と名前を表示する。既にストアにプロフィールが存在する場合は再取得しない |
| ユーザー投稿一覧取得 | ユーザーの投稿データをAPIから取得し、ストアに格納する |
| ログアウト処理 | ストアの `logout` を呼び出し、`/login` へリダイレクトする |
| 新規投稿作成への導線 | `/posts/new` へのリンクボタンを提供する |
| ローディング・エラーハンドリング | 読み込み中・エラー発生時に `StatusInfo` コンポーネントで適切なステータスを表示する |

## 提供するコンポーネント

### `UsersPage`

- **ファイル**: `mypage/UsersPage.tsx`
- **役割**: マイページのページコンポーネント。レイアウト用のラッパーdivを持ち、`User` コンポーネントを描画する
- **props**: なし

### `User`

- **ファイル**: `mypage/components/User.tsx`
- **役割**: マイページの実体となるクライアントコンポーネント（`"use client"`）。以下の要素を含む：
  - ページタイトル「Mypage」（Jostフォント、青色）
  - ユーザーアイコン画像（丸型、140x140px、青色ボーダー）とユーザー名
  - ログアウトボタン（`Danger` モード）
  - 新規投稿作成ボタン（`Info` モード、`/posts/new` へのリンク）
  - ユーザー投稿一覧（`UserPostListPage` コンポーネント）
- **状態遷移**:
  - `isLoading === true` → `<StatusInfo status="loading" />` を表示
  - `error` が存在 → `<StatusInfo status="service-down" />` を表示
  - `userProfile` が `null` → 「ユーザー情報を読み込み中です...」テキストを表示
  - 正常時 → プロフィール情報・ボタン・投稿一覧を表示

## 提供するHooks

このFeature固有のカスタムフックは定義されていない。

以下の外部フックを使用している：

| フック | 提供元 | 用途 |
|--------|--------|------|
| `useRequireAuth` | `@/features/posts/shared/hooks` | 認証済みかどうかのチェック。`isAuthChecked` を返し、データ取得の実行制御に使用 |
| `useAuthStore` | `@/shared/stores` | `userProfile`、`setUserProfile`、`logout` の取得 |
| `usePostStore` | `@/shared/stores` | `setUserPosts`、`isLoading`、`error`、`setLoading`、`setError` の取得 |

## 状態管理（Store）

このFeature固有のストアは定義されていない。共有ストアを利用している。

### `useAuthStore`（`@/shared/stores`）

| プロパティ/メソッド | 型（推定） | 用途 |
|---------------------|------------|------|
| `userProfile` | `UserProfile \| null` | ユーザープロフィール情報の保持 |
| `setUserProfile` | `(profile: UserProfile \| null) => void` | プロフィール情報のストアへの格納 |
| `logout` | `() => void` | ログアウト処理（認証状態のクリア） |

### `usePostStore`（`@/shared/stores`）

| プロパティ/メソッド | 型（推定） | 用途 |
|---------------------|------------|------|
| `setUserPosts` | `(posts: Post[]) => void` | ユーザー投稿一覧のストアへの格納 |
| `isLoading` | `boolean` | ローディング状態 |
| `error` | `string \| null` | エラーメッセージ |
| `setLoading` | `(loading: boolean) => void` | ローディング状態の更新 |
| `setError` | `(error: string \| null) => void` | エラー状態の更新 |

## 使用している外部依存

### Feature内部API

| 関数 | ファイル | 説明 |
|------|----------|------|
| `fetchUserData` | `mypage/api/fetchUserData.ts` | `@/shared/api/fetchData` の `fetchUserData` をラップ。`UserProfile \| null` を返す |
| `fetchUserPosts` | `mypage/api/fetchUserPosts.ts` | `@/shared/api/fetchData` の `fetchUserPosts` をラップ。`Post[] \| null` を返す |

### 共有モジュール

| モジュール | パス | 用途 |
|------------|------|------|
| `Button` | `@/shared/components/button` | ログアウトボタン・新規投稿作成ボタンの描画 |
| `StatusInfo` | `@/shared/components/statusInfo` | ローディング・エラー状態の表示 |
| `jost` | `@/shared/components/font` | ページタイトルのフォント指定 |
| `getErrorMessage` | `@/shared/lib/getErrorMessage` | エラーオブジェクトからメッセージ文字列を抽出 |
| `UserProfile`, `Post` | `@/shared/types` | API型定義 |

### 他Feature依存

| モジュール | パス | 用途 |
|------------|------|------|
| `UserPostListPage` | `@/features/posts/user-list/UserPostListPage` | ユーザー投稿一覧の表示コンポーネント |
| `useRequireAuth` | `@/features/posts/shared/hooks` | 認証チェックフック |

### 外部ライブラリ

| ライブラリ | 使用箇所 |
|------------|----------|
| `next/link` | 新規投稿作成ページへのリンク |
| `next/navigation`（`useRouter`） | ログアウト後のリダイレクト |
| `next/image` | ユーザーアイコン画像の最適化表示 |
| `react`（`useEffect`） | マウント時のデータ取得 |

## 使用されている箇所（routes）

コードから直接読み取れるルート情報：

| ルート | 説明 |
|--------|------|
| マイページ（パスはコードから特定不可、ファイルパスの `mypage` から `/mypage` と推定される） | `UsersPage` がページコンポーネントとして配置される |
| `/login` | ログアウト後のリダイレクト先 |
| `/posts/new` | 新規投稿作成ページへの遷移先 |

## 補足・制約

- `User` コンポーネントは `"use client"` ディレクティブが付与されており、クライアントサイドでのみ実行される
- `useEffect` の依存配列に `isAuthChecked` と `userProfile` が含まれており、認証チェック完了後かつプロフィール情報の変更時にデータ取得が再実行される
- `userProfile` が既にストアに存在する場合、`fetchUserData` のAPI呼び出しはスキップされるが、`fetchUserPosts` は毎回実行される
- ユーザーアイコン画像は `userProfile.iconSignedUrl`（署名付きURL）を使用しており、有効期限がある可能性がある
- `@/features/posts/shared/hooks` の `useRequireAuth` および `@/features/posts/user-list/UserPostListPage` に依存しており、`posts` Featureとの結合がある
- エラー発生時は `status="service-down"` として表示され、ユーザーにはサービス障害として通知される
- `Image` コンポーネントの `width`/`height` props（100）とCSS指定（140px）が異なっており、CSSが優先される

<!-- META -->
Feature ID: users
最終更新日: 2026-04-13
<!-- /META -->