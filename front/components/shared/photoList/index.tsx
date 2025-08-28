import React from "react";
import Image from "next/image";

export interface PhotoListProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function PhotoList({ src, alt, width, height }: PhotoListProps) {
  return (
    <div className="relative text-center">
      <div className="w-[50%] h-[35px] absolute top-[-20px] left-1/2 translate-x-[-50%] opacity-50 bg-orange-50 origin-[-3deg]"></div>
      <div className="shadow-xl md:overflow-hidden md:max-w-[400px] border-[6px] border-white inline-block">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className="object-cover md:h-[300px]"
        />
      </div>
    </div>
  );
}
