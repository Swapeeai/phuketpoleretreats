import Image from "next/image";
import type { ReactNode } from "react";

export function ScenicBand({
  src,
  alt,
  className = "relative h-40 w-full overflow-hidden sm:h-56",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Image src={src} alt={alt} fill sizes="100vw" quality={70} className="object-cover" />
      <div className="absolute inset-0 bg-jungle/25" />
    </div>
  );
}

export function ScenicSection({
  src,
  alt,
  overlayClassName = "bg-jungle/75",
  children,
}: {
  src: string;
  alt: string;
  overlayClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-20 text-white">
      <Image src={src} alt={alt} fill sizes="100vw" quality={70} className="object-cover" />
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
