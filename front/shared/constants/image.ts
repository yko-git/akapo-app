// 許可する画像形式
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;

// ファイルサイズ制限（MB）
export const MAX_FILE_SIZE_MB = 5;

// ファイルサイズ制限
export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
} as const;

// バリデーション用のヘルパー定数
export const FILE_SIZE_BYTES_TO_MB = 1024 * 1024;
