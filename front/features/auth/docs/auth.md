# auth

![feature](../../../docs/screens/auth.png)

## Feature概要

ユーザーの**ログイン**および**新規アカウント登録**を提供する認証機能。ログインIDとパスワードによる認証方式を採用しており、新規登録時にはアカウント名とアイコン画像の設定が可能。ログイン・新規ユーザー登録は午前9時〜午後9時の時間帯に利用可能である旨がUI上に案内されている。

## 主要な責務

| 責務 | 説明 |
|------|------|
| ログイン処理 | ログインID・パスワードを用いてAPIにログインリクエストを送信し、認証トークンを取得する |
| ユーザープロフィール取得・保存 | ログイン成功後にユーザーデータを取得し、`useAuthStore` のストアに保存する |
| 新規ユーザー登録 | ログインID・パスワード・アカウント名・アイコン画像を入力し、APIにユーザー作成リクエストを送信する |
| フォームバリデーション | Zod スキーマ（`NewLoginSchema` / `NewUserSchema`）と `react-hook-form` によるバリデーションを実施する |
| 画像圧縮・プレビュー | 新規登録時にアイコン画像を `browser-image-compression` で圧縮し、FileReader によるプレビュー表示を行う |
| 画像ファイルバリデーション | `validateImageFile` ユーティリティによりアップロードファイルの妥当性を検証する |
| フィードバック通知 | `react-hot-toast` を用いてログイン成功/失敗・登録完了/失敗時のトースト通知を表示する |
| ページ遷移 | ログイン成功時は `/mypage` へ、ユーザー登録成功時は `/login` へ遷移する |

## 提供するコンポーネント

### `LoginPage`
- **パス**: `login/LoginPage.tsx`
- **種別**: ページコンポーネント（Server Component）
- **説明**: ログインページ全体のレイアウトを構成する。見出し「Login」、利用可能時間の案内テキスト、`LoginForm` コンポーネント、および新規アカウント登録ページ（`/signup`）へのリンクを配置する。

### `LoginForm`
- **パス**: `login/components/LoginForm.tsx`
- **種別**: Client Component（`"use client"`）
- **説明**: ログインID・パスワードの入力フォーム。`useLoginForm` フックでフォーム制御を行い、送信時に `createLogin` API を呼び出す。認証成功後は `fetchUserData` でユーザー情報を取得し、`useAuthStore.setUserProfile` でストアに保存してから `/mypage` へ遷移する。送信中は `isSubmitting` ステートによりボタンを無効化し「ログイン中です...」と表示する。

### `CreateUserPage`
- **パス**: `register/CreateUserPage.tsx`
- **種別**: ページコンポーネント（Server Component）
- **説明**: 新規ユーザー登録ページ全体のレイアウトを構成する。見出し「Signin」、利用可能時間の案内テキスト、「新規ユーザー登録」小見出し、および `CreateUser` コンポーネントを配置する。

### `CreateUser`
- **パス**: `register/components/CreateUser.tsx`
- **種別**: Client Component（`"use client"`）
- **説明**: ログインID・パスワード・アカウント名・アイコン画像の入力フォーム。`useUserForm` フックでフォーム制御を行う。画像選択時には `FileReader` でプレビューを生成し、円形（`rounded-full`）で表示する。送信時には `validateImageFile` でファイルを検証後、`browser-image-compression` で圧縮してから `createUser` API を呼び出す。登録成功後は `/login` へ遷移する。送信中はボタンを無効化し「登録中...」と表示する。

## 提供するHooks

### `useLoginForm`
- **パス**: `login/hooks/useLoginForm.tsx`
- **引数**: `defaultValues?: Partial<NewLogin>`（省略時は `{ loginId: "", password: "" }`）
- **戻り値**: `{ register, handleSubmit, errors, reset }`
- **説明**: `react-hook-form` と `zodResolver` を用いたログインフォーム用カスタムフック。バリデーションスキーマとして `NewLoginSchema` を使用し、バリデーションモードは `onBlur`。

### `useUserForm`
- **パス**: `register/hooks/useUserForm.ts`
- **引数**: `defaultValues?: Partial<NewUser>`（省略時は `{ loginId: "", name: "", password: "" }`）
- **戻り値**: `{ register, handleSubmit, control, errors, reset }`
- **説明**: `react-hook-form` と `zodResolver` を用いた新規ユーザー登録フォーム用カスタムフック。バリデーションスキーマとして `NewUserSchema` を使用し、バリデーションモードは `onBlur`。

## 状態管理（Store）

### `useAuthStore`（外部共有ストア）
- **インポート元**: `@/shared/stores`
- **使用しているアクション**: `setUserProfile(userData)` — ログイン成功後に取得したユーザーデータをストアに保存する
- **使用箇所**: `LoginForm` コンポーネント

### コンポーネントローカル状態

| コンポーネント | state | 型 | 用途 |
|---|---|---|---|
| `LoginForm` | `isSubmitting` | `boolean` | ログインAPI呼び出し中のローディング制御 |
| `CreateUser` | `isSubmitting` | `boolean` | ユーザー登録API呼び出し中のローディング制御 |
| `CreateUser` | `file` | `File \| null` | アップロード対象のアイコン画像ファイル |
| `CreateUser` | `preview` | `string \| null` | アイコン画像のプレビュー用Data URL |

## 使用している外部依存

| パッケージ / モジュール | 用途 |
|---|---|
| `next/link` | 新規アカウント登録ページへのリンク（`/signup`） |
| `next/navigation` (`useRouter`) | ログイン成功後・登録成功後のページ遷移 |
| `react-hook-form` | フォーム状態管理・バリデーション制御 |
| `@hookform/resolvers/zod` | Zod スキーマを react-hook-form のリゾルバとして使用 |
| `react-hot-toast` | 成功・失敗時のトースト通知 |
| `browser-image-compression` | アイコン画像の圧縮処理 |
| `@/shared/components/font` (`jost`) | 見出しフォント（Jost） |
| `@/shared/components/button` (`Button`) | 共通ボタンコンポーネント |
| `@/shared/api/fetchData` | `createLogin`（ログインAPI）、`fetchUserData`（ユーザーデータ取得API）、`createUser`（ユーザー作成API） |
| `@/shared/schemas` | `NewLogin` / `NewLoginSchema`（ログインフォーム型・スキーマ）、`NewUser` / `NewUserSchema`（ユーザー登録フォーム型・スキーマ） |
| `@/shared/stores` | `useAuthStore`（認証ストア） |
| `@/shared/constants/image` | `IMAGE_COMPRESSION_OPTIONS`（画像圧縮オプション設定） |
| `@/shared/lib/validateImageFile` | `validateImageFile`（画像ファイルバリデーションユーティリティ） |

## 使用されている箇所（routes）

| ページ | コンポーネント | 推定ルート |
|---|---|---|
| ログインページ | `LoginPage` | `/login` |
| 新規ユーザー登録ページ | `CreateUserPage` | `/signup` |

※ `LoginPage` 内のリンクは `/signup` を指し、`CreateUser` の登録成功後の遷移先は `/login` を指しているため、上記ルートが使用されていると判断できる。

## 補足・制約

- **利用時間制限**: UI上に「午前9時〜午後9時の間にご利用いただけます」と案内されている。ただし時間制限のフロントエンド側での制御ロジックはこのFeature内のコードには含まれておらず、サーバーサイドまたは別レイヤーで制御されていると考えられる。
- **画像必須**: `CreateUser` の `onSubmit` では `validateImageFile(file)` が `false` を返した場合に処理を中断するため、アイコン画像のアップロードは必須と読み取れる。
- **見出しの表記差異**: `LoginPage` では見出しが「Login」、`CreateUserPage` では「Signin」となっているが、`CreateUserPage` の実際の機能は新規ユーザー登録（Sign Up）である。
- **API層の分離**: `login/api/` および `register/api/` にて `@/shared/api/fetchData` をラップする薄いAPI関数が提供されており、Feature内でのAPI呼び出しを間接化している。
- **バリデーションモード**: ログイン・登録フォームともにバリデーションモードは `onBlur`（フォーカスアウト時にバリデーション実行）。
- **画像圧縮**: 圧縮オプションは `@/shared/constants/image` の `IMAGE_COMPRESSION_OPTIONS` に定義されており、このFeature内では具体的な圧縮パラメータは管理していない。
- **エラーハンドリング**: ログイン失敗時・登録失敗時はトースト通知でユーザーにフィードバックし、コンソールにエラーログを出力する（ログインのみ `console.error` あり）。

<!-- META -->
Feature ID: auth
最終更新日: 2026-04-13
<!-- /META -->