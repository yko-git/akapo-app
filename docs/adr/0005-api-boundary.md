# 0005-api-boundary

Frontend / Backend 分離を前提とした API境界設計を採用

## 適用範囲

本プロジェクトの Frontend・Backend　間の通信に適用する

## 背景

Frontend・Backend を責務分離し、APIを通じてデータ通信を行う構成にしたい。
認証・データ取得・更新処理を Backend に集約し、UI表示を Frontendに集中できる構成にしたい。

## 選択肢

### Frontend から DB へ直接アクセス

- シンプルな構成
- 初期実装が容易
- セキュリティリスクが高い
- ビジネスロジックが分散しやすい

### API 境界を設ける構成

- Frontend は API を通じて通信
- Backend が認証・DB操作を管理
- Frontend / Backend の責務分離が明確になる
- 認証・認可を Backend に集約できる
- API中心設計に統一できる
- API設計が必要

## 決定

API 境界を設けた Frontend / Backend 分離構成を採用

## 理由

- Frontend を UIに集中させたい
- API設計を学習したい

## トレードオフ

- API設計・保守コストが発生する
