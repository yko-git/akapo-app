# posts

![feature](../../../docs/screens/posts.png)

## Feature概要

投稿（posts）に関する CRUD 操作および一覧表示を担う Feature。投稿の作成・詳細表示・一覧表示（フィルタリング・ページネーション付き）・編集・削除の各機能を提供し、認証済みユーザーのみがアクセスできるよう制御されている。

## 主要な責務

- **投稿の作成**: 題名・本文・ステータス（下書き/本番）・カテゴリー・画像を入力し、新規投稿を作成する
- **投稿の一覧表示**: 全投稿をグリッドレイアウトで表示し、カテゴリーフィルター・ユーザーフィルター・ページネーションに対応する
- **投稿の詳細表示**: 個別投稿の画像・タイトル・本文・投稿者情報・カテゴリー・作成日を表示し、コメント一覧とコメント作成機能を統合する
- **投稿の編集**: 既存投稿のタイトル・本文・ステータス・カテゴリー・画像を更新する。画像は未選択時に既存画像を保持する
- **ユーザー投稿一覧の管理**: ログインユーザー自身の投稿をテーブル形式で表示し、編集・削除操作を提供する
- **認証ガード**: 各ページで `localStorage` のトークン有無を確認し、未認証時は `/login` へリダイレクトする
- **画像圧縮**: 投稿作成・編集時に `browser-image-compression` を用いてクライアントサイドで画像を圧縮する
- **新着コメント判定**: 各投稿のコメントを取得し、24時間以内のコメントがあれば `hasNewComment` フラグを付与する

## 提供するコンポーネント

### ページコンポーネント

| コンポーネント名 | パス | 説明 |
|---|---|---|
| `CreatePostPage` | `create/CreatePostPage.tsx` | 新規投稿作成ページ。`CreatePost` フォームと投稿一覧への戻りリンクを配置する |
| `PostDetailPage` | `detail/PostDetailPage.tsx` | 投稿詳細ページ。URLパラメータから `id` を取得し `PostDetail` に渡す。`"use client"` 指定 |
| `PostListPage` | `list/PostListPage.tsx` | 投稿一覧ページ。データ取得・フィルタリング・ページネーション・ローディング/エラー/空状態の制御を行う。`"use client"` 指定 |
| `PatchPostPage` | `patch/PatchPostPage.tsx` | 投稿編集ページ。URLパラメータから `id` を取得し `PatchPost` フォームに渡す。`"use client"` 指定 |
| `UserPostListPage` | `user-list/UserPostListPage.tsx` | ユーザー投稿一覧ページ。`UserPostList` を表示する |

### UIコンポーネント

| コンポーネント名 | パス | 説明 |
|---|---|---|
| `CreatePost` | `create/components/CreatePost.tsx` | 投稿作成フォーム。題名・本文・ステータス・カテゴリー・画像の入力を受け付け、バリデーション・画像圧縮・プレビュー表示を行い、作成後 `/mypage` へ遷移する |
| `PostDetail` | `detail/components/PostDetail.tsx` | 投稿詳細表示。投稿データとコメントを取得し、画像・メタ情報・本文を表示する。`CommentsList` と `CreateComment`（comments Feature）を統合している |
| `FilterNav` | `list/components/FilterNav.tsx` | カテゴリーフィルターナビゲーション。`CATEGORIES_TYPES` 定数に基づきフィルターリンクを生成し、アクティブ状態をトグルする。「すべて」リンクも提供する |
| `PostList` | `list/components/PostList.tsx` | 投稿一覧グリッド。各投稿のサムネイル画像・カテゴリータグ・コメント数・新着コメントバッジ・タイトル・投稿者アイコン/名前・作成日を表示する |
| `PatchPost` | `patch/components/PatchPost.tsx` | 投稿編集フォーム。既存投稿データをフェッチしてフォームに初期値設定し、画像変更時は新規アップロード、未変更時は既存画像を保持する。更新後 `/mypage` へ遷移する |
| `UserPostList` | `user-list/components/UserPostList.tsx` | ユーザー投稿一覧テーブル。`userPosts` を作成日降順でソートし、タイトル・本文（先頭25文字）・画像・カテゴリー・編集リンク・削除ボタンを表示する。削除時は `window.confirm` で確認を行う |

## 提供するHooks

### `useRequireAuth`（`shared/hooks/useRequireAuth.ts`）

| 項目 | 内容 |
|---|---|
| 戻り値 | `boolean`（認証チェック完了フラグ） |
| 役割 | `localStorage` から `token` を取得し、存在しない場合は `/login` へリダイレクトする。トークンが存在すれば `checked` を `true` に設定する |
| 使用箇所 | `PostListPage`, `PostDetail`, `CreatePost` |

### `usePostForm`（`shared/hooks/usePostForm.ts`）

| 項目 | 内容 |
|---|---|
| 戻り値 | `{ register, handleSubmit, control, errors, reset }` |
| 役割 | `react-hook-form` + `zod`（`NewPostSchema`）による投稿フォームのバリデーションと状態管理を提供する |
| デフォルト値 | `title: ""`, `body: ""`, `status: "0"`, `categoryIds: [1]` |
| バリデーションモード | `onBlur` |
| 使用箇所 | `CreatePost`, `PatchPost` |

### `useCategoryFilter`（`list/hooks/useCategoryFilter.ts`）

| 項目 | 内容 |
|---|---|
| 戻り値 | `{ category: string \| null, isFiltered: boolean }` |
| 役割 | URLクエリパラメータ `category` を取得し、正規化して返す |
| 使用箇所 | `PostListPage` |

### `usePostsFilter`（`list/hooks/usePostsFilter.ts`）

| 項目 | 内容 |
|---|---|
| 戻り値 | `{ userName: string \| null, isFiltered: boolean }` |
| 役割 | URLクエリパラメータ `user` を取得し、正規化して返す |
| 使用箇所 | `PostListPage` |

### `usePostsPage`（`list/hooks/usePostsPage.ts`）

| 項目 | 内容 |
|---|---|
| 戻り値 | `{ page: number, limit: number, offset: number }` |
| 役割 | URLクエリパラメータ `page`・`limit` からページネーション状態を計算する。デフォルトは `page=1`, `limit=8`。最小値は1に制限される |
| 使用箇所 | `PostListPage` |

## 状態管理（Store）

### `usePostStore`（`@/shared/stores`）

コードから読み取れる使用プロパティ・メソッド:

| プロパティ/メソッド | 型（推定） | 説明 |
|---|---|---|
| `posts` | `PostWithComments[]` | 投稿一覧データ（コメント数・新着コメントフラグ付き） |
| `currentPost` | `Post \| null` | 現在表示中の投稿詳細データ |
| `userPosts` | `Post[]` | ログインユーザーの投稿一覧 |
| `isLoading` | `boolean` | ローディング状態 |
| `error` | `string \| null` | エラーメッセージ |
| `setPosts` | `(posts: PostWithComments[]) => void` | 投稿一覧を設定 |
| `setCurrentPost` | `(post: Post \| null) => void` | 現在の投稿を設定 |
| `setLoading` | `(loading: boolean) => void` | ローディング状態を設定 |
| `setError` | `(error: string \| null) => void` | エラー状態を設定 |
| `removePost` | `(id: number) => void` | 指定IDの投稿をストアから削除 |

### `useCommentStore`（`@/shared/stores`）

コードから読み取れる使用プロパティ・メソッド:

| プロパティ/メソッド | 型（推定） | 説明 |
|---|---|---|
| `setComments` | `(comments: Comment[]) => void` | コメント一覧を設定 |
| `reset` | `() => void` | コメントストアをリセット |

### `PostWithComments` 型（`@/shared/stores`）

`Post` を拡張し、以下のプロパティを追加した型:

| プロパティ | 型 | 説明 |
|---|---|---|
| `commentCount` | `number` | 投稿に紐づくコメント数 |
| `hasNewComment` | `boolean` | 24時間以内のコメントが存在するか |

## 使用している外部依存

| パッケージ/モジュール | 用途 |
|---|---|
| `next/link` | ページ間遷移リンク |
| `next/navigation`（`useParams`, `useRouter`, `useSearchParams`） | URLパラメータ取得・プログラマティック遷移・クエリパラメータ取得 |
| `next/image` | 最適化画像表示（ユーザーアイコン・投稿サムネイル） |
| `react-hook-form`（`useForm`, `Controller`） | フォーム状態管理・バリデーション |
| `@hookform/resolvers/zod`（`zodResolver`） | Zodスキーマによるバリデーション連携 |
| `react-hot-toast` | 成功/エラー時のトースト通知 |
| `browser-image-compression` | クライアントサイドでの画像圧縮 |
| `@/shared/api/fetchData` | API通信関数群（`fetchPosts`, `fetchPost`, `fetchComments`, `createPost`, `patchPost`, `uploadImage`, `deletePost`） |
| `@/shared/schemas`（`NewPost`, `NewPostSchema`, `Post`） | 投稿データのスキーマ定義・型 |
| `@/shared/stores`（`usePostStore`, `useCommentStore`, `PostWithComments`） | グローバル状態管理ストア |
| `@/shared/components/button` | 共通ボタンコンポーネント（`mode`: `Success`, `Info`, `Danger`） |
| `@/shared/components/selectBox` | 共通セレクトボックスコンポーネント（単一・複数選択対応） |
| `@/shared/components/statusInfo` | ステータス表示コンポーネント（`loading`, `service-down`, `empty`） |
| `@/shared/components/photo` | 投稿詳細画像表示コンポーネント |
| `@/shared/components/photoList` | 投稿一覧サムネイル画像表示コンポーネント |
| `@/shared/components/tagList` | カテゴリータグ一覧表示コンポーネント |
| `@/shared/components/font`（`jost`） | Jostフォント定義 |
| `@/shared/components/pageNation`（`PageNation`） | ページネーションコンポーネント |
| `@/shared/constants/image`（`IMAGE_COMPRESSION_OPTIONS`） | 画像圧縮オプション定数 |
| `@/shared/constants/categories`（`CATEGORIES_TYPES`） | カテゴリー種別定数 |
| `@/shared/constants/status`（`STATUS_LIST`） | ステータス（下書き/本番）定数 |
| `@/shared/lib/validateImageFile` | 画像ファイルバリデーションユーティリティ |
| `@/shared/lib/getErrorMessage` | エラーオブジェクトからメッセージを抽出するユーティリティ |
| `@/shared/types`（`PostDetailProps`, `FilterNavProps`, `PostListProps`） | 各コンポーネントのProps型定義 |
| `@/features/comments/create/components/CreateComment` | コメント作成コンポーネント（comments Feature） |
| `@/features/comments/list/components/CommentsList` | コメント一覧コンポーネント（comments Feature） |

## 使用されている箇所（routes）

コードから読み取れるルーティング構造:

| ルートパス（推定） | ページコンポーネント | 説明 |
|---|---|---|
| `/` | `PostListPage` | 投稿一覧。`?category=`, `?user=`, `?page=`, `?limit=` クエリ対応 |
| `/posts/[id]` | `PostDetailPage` | 投稿詳細表示 |
| `/posts/new` | `CreatePostPage` | 新規投稿作成 |
| `/posts/new/[id]` | `PatchPostPage` | 投稿編集（編集リンクが `/posts/new/${item.id}` を指している） |
| `/mypage` | `UserPostListPage`（の一部として使用） | ユーザー投稿管理。作成・編集完了後の遷移先 |
| `/login` | （外部Feature） | 未認証時のリダイレクト先 |

## 補足・制約

- **フィルタリング時の全件取得**: カテゴリーまたはユーザーフィルターが指定されている場合、API に `limit: 1000, offset: 0` で全件取得してからクライアントサイドでフィルタリングを行う。投稿数が大量になった場合、パフォーマンスへの影響が懸念される
- **ページネーションとフィルターの排他制御**: カテゴリーフィルターまたはユーザーフィルターが適用されている場合、ページネーションコンポーネントは表示されない
- **認証方式**: `localStorage` の `token` 有無のみで認証チェックを行う簡易的な方式。トークンの有効期限検証は行わない
- **新着コメント判定**: コメントの `createdAt` から24時間以内かどうかで `hasNewComment` を判定する。この判定はクライアントのシステム時刻に依存する
- **画像バリデーション**: `validateImageFile` に第2引数（`required`）を渡すことで、新規作成時は必須、編集時は任意とする制御が行われている（`CreatePost` は `file` のみ、`PatchPost` は `file, false` を渡している）
- **画像アップロード方式の違い**: 新規作成時は `createPost` API にファイルとデータを一括送信するが、編集時は `uploadImage` で画像を先にアップロードし、返却された `safeFilePath` を `data.imageKey` に設定してから `patchPost` を呼び出す2段階方式
- **コンポーネントのアンマウント時クリーンアップ**: `PostDetail` では `useEffect` のクリーンアップ関数で `setCurrentPost(null)` と `reset()` を呼び出し、ストアの状態を初期化している
- **ユーザー投稿一覧のソート**: `UserPostList` では `userPosts` を作成日の降順（新しい順）でクライアントサイドソートしている
- **削除確認**: `UserPostList` の削除操作では `window.confirm` によるブラウザネイティブの確認ダイアログを使用している
- **レスポンシブ対応**: 投稿一覧は `xl:grid-cols-4`, `lg:grid-cols-3`, `md:grid-cols-2`, デフォルト `grid-cols-1` のグリッドレイアウト。投稿詳細は `md` ブレークポイントでレイアウトを切り替え、本文の表示位置がデスクトップとモバイルで異なる
- **Feature間依存**: `PostDetail` は `@/features/comments` Feature の `CreateComment` と `CommentsList` コンポーネントに依存している

<!-- META -->
Feature ID: posts
最終更新日: 2026-04-13
<!-- /META -->