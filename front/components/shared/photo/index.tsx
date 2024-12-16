import Image from "next/image";

export default function Photo(src: any, alt: string) {
  return (
    <div className="relative text-center">
      <div className="w-[50%] h-[35px] absolute top-[-20px] left-1/2 translate-x-[-50%] opacity-50 bg-orange-50 origin-[-3deg]"></div>
      <Image
        className="shadow-xl object-cover md:max-w-[400px] max-h-[542px] border-[6px] border-white inline-block"
        src={src}
        alt={alt}
        loading="lazy"
      />
    </div>
  );
}
