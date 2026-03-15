# 画面名
ユーザーページ

# 必須構成

## 1. 画面概要
ユーザーのプロフィール情報と投稿一覧を表示するページです。ログアウト機能と新規投稿作成機能も提供しています。

## 2. ![screen](../../docs/screens/user-page.png)

## 3. URL
/mypage

## 4. フォーム項目・表示要素
- ユーザーのアイコン画像
- ユーザー名
- ログアウトボタン
- 新規投稿作成ボタン
- ユーザーの投稿一覧

## 5. 初期表示・デフォルト値
- ユーザー情報の読み込み中は「ユーザー情報を読み込み中です...」と表示する
- ユーザー情報の取得に失敗した場合は、エラーメッセージを表示する

## 6. ユーザー操作
- ログアウトボタンをクリックするとログアウトし、ログインページ(/login)に遷移する
- 新規投稿作成ボタンをクリックすると、新規投稿ページ(/posts/new)に遷移する

## 7. バリデーション・エラーハンドリング
- ユーザー情報の取得に失敗した場合は、エラーメッセージを表示する

## 8. 画面遷移
- ログアウトボタンをクリックすると、ログインページ(/login)に遷移する
- 新規投稿作成ボタンをクリックすると、新規投稿ページ(/posts/new)に遷移する

## 9. 使用しているコンポーネント
- User
- Button
- StatusInfo
- Image
- UserPostListPage

## 10. 使用しているHooks / Stores / API / Schema
- useAuthStore
- usePostStore
- useRequireAuth
- fetchUserData
- fetchUserPosts
- UserProfile
- Post

## 11. 補足・制約
- ユーザー情報の取得には認証が必要であり、認証されていない場合はログインページに遷移する

<!-- META -->
- 画面ID: user-page
- 最終更新日: 2026-03-15
<!-- /META -->

# 実装コード

### app/mypage/page.tsx
このファイルは、ユーザーページのエントリーポイントです。`UsersPage`コンポーネントをデフォルトでエクスポートしています。

### features/users/mypage/UsersPage.tsx
このファイルは、ユーザーページの主要なコンポーネントです。`User`コンポーネントを表示しています。

### features/users/mypage/components/User.tsx
このファイルは、ユーザーページの`User`コンポーネントです。ユーザー情報の表示、ログアウト機能、新規投稿作成機能を提供しています。

### features/users/mypage/api/fetchUserData.ts
このファイルは、ユーザー情報を取得するAPIを定義しています。

### features/users/mypage/api/fetchUserPosts.ts
このファイルは、ユーザーの投稿一覧を取得するAPIを定義しています。