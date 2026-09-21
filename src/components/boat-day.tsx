import Image from "next/image";
import { SCENERY } from "@/lib/images";
import { LIVE } from "@/lib/live-copy";

export function BoatDay() {
  return (
    <section id="boat-trip" className="bg-background py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden border border-border bg-card shadow-sm lg:grid-cols-2">
        <div className="relative min-h-72 lg:min-h-[28rem]">
          <Image
            src={SCENERY.longtailLagoon.src}
            alt={SCENERY.longtailLagoon.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={70}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center bg-sky/50 px-6 py-10 sm:px-10 sm:py-14">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            {LIVE.boatDayEyebrow}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{LIVE.boatDayTitle}</h2>
          <p className="mt-5 text-base leading-relaxed text-foreground">{LIVE.boatDayLead}</p>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">{LIVE.boatDayBody}</p>
        </div>
      </div>
    </section>
  );
}
