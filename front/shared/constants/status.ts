// UI状態の定数
export const STATUS_INFO = [
  "loading",
  "service-down",
  "success",
  "empty",
] as const;

export const STATUS_LIST = [
  { value: "0", label: "下書き" },
  { value: "1", label: "公開" },
];
