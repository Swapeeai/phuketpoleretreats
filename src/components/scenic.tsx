import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ScenicBand({
  src,
  alt,
  className = "relative h-44 w-full overflow-hidden sm:h-64",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Image src={src} alt={alt} fill sizes="100vw" quality={70} className="object-cover" />
      <div className="absolute inset-0 bg-sky/15" />
    </div>
  );
}

export function ScenicSection({
  src,
  alt,
  overlayClassName = "bg-gradient-to-b from-sky/70 via-white/72 to-sky/75",
  className,
  children,
}: {
  src: string;
  alt: string;
  overlayClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("relative overflow-hidden py-24 text-foreground sm:py-28", className)}>
      <Image src={src} alt={alt} fill sizes="100vw" quality={70} className="object-cover" />
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
