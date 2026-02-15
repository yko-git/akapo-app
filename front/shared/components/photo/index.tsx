import { PhotoProps } from "@/shared/types";
import Image from "next/image";

export default function Photo({ src, alt }: PhotoProps) {
  return (
    <div className="relative text-center">
      <div className="w-[50%] h-[35px] absolute top-[-20px] left-1/2 -translate-x-1/2 opacity-50 bg-orange-50 rotate-[-3deg]"></div>
      <div className="shadow-xl md:overflow-hidden md:w-[500px] w-full max-w-full mx-auto flex-shrink-0 border-[6px] border-white">
        <Image
          src={src}
          alt={alt}
          width={500}
          height={500}
          loading="lazy"
          className="object-cover w-full h-auto"
        />
      </div>
    </div>
  );
}
