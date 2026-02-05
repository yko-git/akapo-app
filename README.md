# akapo

こちらは、[akapo](https://akapo-front.vercel.app/) の開発用リポジトリです。

**子どもや自身の工作・作品を投稿し、コメントで交流できるギャラリーサービス**です。  
フロントエンドとバックエンドを分離し、認証付きAPIを前提に設計・実装しています。

---

<img width="889" height="565" alt="image" src="https://github.com/user-attachments/assets/49b9a809-828d-44de-a98c-1e3977c608a0" />

---

### トップページ

<img width="1337" height="738" alt="image" src="https://github.com/user-attachments/assets/8b12c002-709e-4b05-b71c-93dfd6c25e46" />

---

### 記事詳細ページ

<img width="881" height="668" alt="image" src="https://github.com/user-attachments/assets/32a01426-723e-4bd8-b55f-92759debc70c" />

---

## 概要

このギャラリーは、**工作が大好きな子どもたちの作品を気軽に残し、みんなで楽しめるサイト**です。

自分の子どもの作品を残すために立ち上げましたが、  
現在は **誰でもアカウントを作成して作品を投稿** できます。

---

## 主な機能

- ユーザー登録 / ログイン
- 作品の投稿（画像付き）
- 作品一覧・詳細表示
- コメント投稿機能
- ユーザーアイコン表示（署名付きURL対応）

---

## ゲストユーザーアカウント

動作確認用に、以下のゲストアカウントをご利用いただけます。

ID: test
PASS: test

ログイン後、作品の投稿・閲覧・コメント投稿が可能です。

---

## 開発背景

主に **自身の学習・インプットを目的** に開発しています。

- フロントエンドとバックエンドを分離した設計
- 認証を前提としたAPI設計
- 非同期処理や状態管理の理解
- 実務を意識した構成・命名
- 認証を前提としたAPI設計（JWT + 認証ミドルウェア）

などを意識しながら実装しています。

akapo を通して、  
**設計に関する技術的な判断力** や  
**実際に使うユーザー視点でのUI・機能設計** を継続的に磨いていきたいと考えています。

---

## 使用技術

### フロントエンド

- Next.js（App Router / Client Components：画面構成・ルーティング）
- TypeScript
- React
- Tailwind CSS
- Vercel

### バックエンド

- Node.js
- Express
- Sequelize
- MySQL（RDS）
- [Posts API レスポンス仕様](https://www.notion.so/Posts-API-2e80029c4d6c80508fe0da001f049021?source=copy_link)

### インフラ・その他

- AWS（EC2 / RDS / S3）
- Cloudflare（DNS）
- Route53
- GitHub Actions（CI/CD）

---

## ドキュメント自動生成（画面仕様）

本リポジトリでは、**フロントエンドの実装コードを起点に画面仕様ドキュメントを自動生成**する仕組みを検証・導入しています。

### 目的

- 実装と仕様書の乖離を防ぐ
- 仕様書のメンテナンスコストを下げる
- コードを Single Source of Truth とした運用

### 仕組み概要

- 対象：React（Next.js）の画面コンポーネント
- 画面実装コードを解析し、AI（Claude API）を利用して画面仕様（Markdown）を生成
- GitHub Actions により、対象ファイル変更時に自動実行
- 生成された仕様書はリポジトリ内にコミットされます

### 出力例

- [front/docs/screens/create-post.md](https://github.com/yko-git/akapo-app/blob/feature/feature-docs/01/front/docs/screens/create-post.md)

この仕組みにより、**画面実装が更新されると、仕様書も自動で更新される**運用を実現しています。

---

## 今後の予定

- UI/UXの改善
- 検索機能（条件検索・ページング）
