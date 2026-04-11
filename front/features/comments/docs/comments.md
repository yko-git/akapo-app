# Feature名

comments

![feature](../../../docs/screens/comments.png)

## Feature概要

投稿詳細ページ上でコメントの作成・一覧表示・削除を担う Feature。コメントデータは `CommentStore` で管理され、投稿者とコメント投稿者の関係によって吹き出しの向きが切り替わる UI を提供する。

## 主要な責務

- コメントのテキスト入力と API 送信（`createComment`）
- 送信後に Store へコメントを追加しUIをリアルタイム更新
- コメント一覧の表示（作成者アイコン・名前・本文）
- コメント削除（`deleteComments`）。削除可能なのは自分のコメントのみ
- 投稿者のコメントは左向き、それ以外は右向きの吹き出しで表示

## 提供するコンポーネント

| コンポーネント | 説明 |
|---|---|
| `CreateComment` | コメント入力フォーム。`postId` を props で受け取り送信を行う |
| `CommentsList` | コメント一覧。`postUserId`・`postId` を props で受け取り、吹き出し表示と削除ボタンを提供 |

## 提供するHooks

なし

## 状態管理（Store）

| Store | 使用箇所 | 操作 |
|---|---|---|
| `useCommentStore` | `CreateComment` | `addComment` で新規コメントを追加 |
| `useCommentStore` | `CommentsList` | `comments` を読み取り、`removeComment` で削除 |
| `useAuthStore` | `CommentsList` | `userProfile` で自分のコメントか判定 |

## 使用している外部依存

| 依存 | 用途 |
|---|---|
| `next/image` (`Image`) | コメント投稿者のアイコン画像表示 |
| `react-hot-toast` | 削除成功・失敗のトースト通知 |
| `@/shared/api/fetchData` (`createComment`, `deleteComments`) | コメント作成・削除 API |
| `@/shared/stores` (`useCommentStore`, `useAuthStore`) | コメント状態・認証状態の参照 |
| `@/shared/types` (`CreateCommentProps`, `CommentListProps`, `Comment`, `NewComment`) | 型定義 |

## 使用されている箇所（routes）

| ルート | 説明 |
|---|---|
| `/posts/[id]` | `PostDetailPage` 内で `CreateComment` と `CommentsList` が使用される |

## 補足・制約

- `CreateComment` はフォームバリデーションなし。空文字でも送信される
- 削除確認は `window.confirm` によるブラウザネイティブダイアログ
- 削除ボタンは `comment.userId === userProfile?.id` の場合のみ表示（投稿者削除権限は `postUserId` と別判定）
- 吹き出しの向きは `comment.userId === postUserId`（投稿者自身かどうか）で制御

<!-- META -->
Feature ID: comments
最終更新日: 2026-04-11
<!-- /META -->

# 実装コード

### create/components/CreateComment.tsx

```tsx
"use client";
import React, { useState } from "react";
import Button from "@/shared/components/button";
import { useCommentStore } from "@/shared/stores";
import { CreateCommentProps } from "@/shared/types";
import { createComment } from "../api";

export default function CreateComment({ postId }: CreateCommentProps) {
  const [body, setBody] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useCommentStore();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const postData = { body, postId };
    try {
      const newComment = await createComment(postId, postData);
      addComment(newComment);
      setBody("");
    } catch (error) {
      console.error("投稿処理中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20">
      <div>
        <div className="font-bold">コメントをいれる</div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border rounded p-2 w-full mt-2"
        />
      </div>
      <div className="text-right mt-4">
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={isSubmitting}
          className="py-4 px-6 text-white text-sm font-semibold tracking-widest rounded-lg"
        >
          {isSubmitting ? "コメント送信中..." : "コメントする"}
        </Button>
      </div>
    </div>
  );
}
```

### list/api/deleteComments.ts

```ts
import { deleteComments as deleteCommentsApi } from "@/shared/api/fetchData";

export const deleteComments = ({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}): Promise<void> => {
  return deleteCommentsApi({ postId, commentId });
};
```
