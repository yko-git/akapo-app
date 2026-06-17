# CLAUDE.md

## プロジェクト概要

https://akapo-front.vercel.app/

## コマンド

- `npm run dev` - 開発サーバー
- `npm run build` - ビルド
- `npm run docs:generate` - 仕様書自動生成

## 技術スタック

- Next.js 14 / React 18 / TypeScript
- Zustand（状態管理）、React Hook Form + Zod（フォーム）
- Tailwind CSS
- Vitest（テスト）

## ディレクトリ構成

- `features/` — Feature単位でコンポーネント・hooks・storeを管理
- `features/docs/` — Feature仕様ドキュメント（自動生成）
