import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LIVE } from "@/lib/live-copy";
import { formatEur } from "@/lib/format";
import { PACKAGES } from "@/lib/retreat";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book the 2027 Phuket Pole Art Retreat",
  description:
    "28th January - 1st February 2027 at Ayara Kamala Resort & Spa Phuket. Pay in full, or €500 deposit today and monthly payments after.",
  alternates: { canonical: "/book" },
};

export default function BookIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.18em] text-primary">{LIVE.heroDates}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{LIVE.bookHeading}</h1>
      <p className="mt-4 max-w-2xl text-[#272727]">{LIVE.accommodationDatesLine}</p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#272727]">
        Pay in full, or €500 deposit today and monthly payments after. {LIVE.depositLive} Bookings
        are non-refundable.
      </p>

      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">{LIVE.priceListLabel}</caption>
          <thead className="bg-secondary text-[#0e0e0e]">
            <tr>
              <th className="px-4 py-3 font-medium">{LIVE.priceListLabel}</th>
              <th className="px-4 py-3 font-medium">Shared</th>
              <th className="px-4 py-3 font-medium">Solo</th>
            </tr>
          </thead>
          <tbody>
            {PACKAGES.map((pkg) => {
              const shared = pkg.variants.find((item) => item.occupancy === "shared") ?? pkg.variants[0];
              const solo = pkg.variants.find((item) => item.occupancy === "solo");
              return (
                <tr key={pkg.slug} className="border-t border-border">
                  <td className="px-4 py-3">{pkg.title}</td>
                  <td className="px-4 py-3">{formatEur(shared.priceCents)}</td>
                  <td className="px-4 py-3">{solo ? formatEur(solo.priceCents) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {PACKAGES.map((pkg) => (
          <article key={pkg.slug} className="overflow-hidden border border-border bg-white">
            <div className="relative h-56">
              <Image
                src={pkg.images[0]}
                alt={pkg.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-3 p-6">
              <h2 className="text-2xl">{pkg.title}</h2>
              <p className="text-sm leading-relaxed text-[#272727]">{pkg.description}</p>
              {pkg.includesHotel ? (
                <p className="text-sm font-medium">
                  Shared {formatEur(pkg.variants.find((v) => v.occupancy === "shared")!.priceCents)} ·
                  Solo {formatEur(pkg.variants.find((v) => v.occupancy === "solo")!.priceCents)}
                </p>
              ) : (
                <p className="text-sm font-medium">{formatEur(pkg.fromCents)}</p>
              )}
              <Link
                href={`/book/${pkg.slug}`}
                className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6")}
              >
                {LIVE.bookNow}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
