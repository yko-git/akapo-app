# 0006-event-bridge

EC2自動起動停止の方式変更

## 適用範囲

本プロジェクトの EC2操作に適用する

## 背景

GitHub Actions を利用した EC2 起動・停止自動化の cron 実行時刻の遅延があり、意図した時刻の起動・停止されない問題があった

## 選択肢

### GitHub Actions

- 現在の構成を継続できる
- GitHub Actions の cron は実行時刻が保証されず不安定
- GitHub Secrets に AWS 認証情報を保持する必要がある

### AWS EventBridge Scheduler

- AWS 内で完結できる
- EC2 管理と相性がいい
- AWS公式サービスでスケジュールを直接設定できる

## 決定

AWS EventBridge Scheduler を採用

## 理由

- AWS内で完結
- GitHub Actions の cron 遅延の影響を受けない
- AWS 認証情報をGitHub Secretsへ保持する必要がなくなるため、セキュリティが向上する
- EC2 のスケジュール管理に適している

## トレードオフ

- AWS リソースが増える
