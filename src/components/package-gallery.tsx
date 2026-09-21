"use client";

import Image from "next/image";
import { useState } from "react";

export function PackageGallery({ title, images }: { title: string; images: string[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
        Photos coming soon for {title}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={current}
          alt={`${title} at Ayara Kamala Resort & Spa — Phuket pole retreat package`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg ring-2 ${
                index === active ? "ring-primary" : "ring-transparent"
              }`}
              aria-label={`Show photo ${index + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
