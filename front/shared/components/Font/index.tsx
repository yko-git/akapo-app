import { Jost, Noto_Sans_JP } from "next/font/google";

// 1. フォントの読み込み
export const jost = Jost({
  weight: ["600"],
  preload: true,
  subsets: ["cyrillic"],
});

export const NotoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: true,
});
