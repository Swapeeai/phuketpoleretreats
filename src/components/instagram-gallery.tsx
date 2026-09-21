import Image from "next/image";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";
import { INSTAGRAM_GALLERY } from "@/lib/images";

export function InstagramGallery() {
  return (
    <section id="instagram" className="bg-sand py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Instagram</p>
            <h2 className="mt-2 text-4xl sm:text-5xl">@{INSTAGRAM_HANDLE}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Studio days, Kamala views, and retreat life at Ayara Kamala. Follow along — tap a
              photo to open Instagram.
            </p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {INSTAGRAM_GALLERY.map((item) => (
            <a
              key={item.src}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-muted"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-jungle/80 to-transparent px-3 py-3 text-sm text-white opacity-0 transition group-hover:opacity-100">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
