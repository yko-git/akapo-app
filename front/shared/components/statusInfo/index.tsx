import { StatusInfoProps } from "@/shared/types";
import Image from "next/image";

export default function StatusInfo({ status, data }: StatusInfoProps) {
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white my-20">
          <p className="text-gray-800 text-lg font-medium mb-2">
            読み込み中です…
          </p>
          <p className="text-gray-600 mb-4">しばらくお待ちください。</p>
        </div>
      </div>
    );
  }
  if (status === "service-down") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white my-20">
          <p className="m-4 inline-block">
            <Image
              src="/common/zzz.png"
              loading="lazy"
              alt=""
              width={160}
              height={100}
            />
          </p>
          <p className="text-gray-800 text-lg font-medium mb-2">
            現在、サービスは一時停止中です。
          </p>
          <p className="text-gray-600 mb-4">
            午前9時から午後9時の間にアクセスしてください。
          </p>
          <hr className="my-4" />
          <p className="text-gray-600">
            Please access between 9:00 AM and 9:00 PM.
          </p>
        </div>
      </div>
    );
  }
  if (status === "empty") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white my-20">
          <p className="text-gray-800 text-lg font-medium mb-2">
            投稿がまだありません。
          </p>
        </div>
      </div>
    );
  }
  return null;
}
