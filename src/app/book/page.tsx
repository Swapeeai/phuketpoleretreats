import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ScenicBand } from "@/components/scenic";
import { buttonVariants } from "@/components/ui/button";
import { LIVE } from "@/lib/live-copy";
import { formatEur } from "@/lib/format";
import { SCENERY } from "@/lib/images";
import { PACKAGES } from "@/lib/retreat";
import { eventJsonLd, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Book the Phuket pole retreat 2027",
  description:
    "Book the Pole Art Retreat at Ayara Kamala — a pole camp and training week in Phuket, 28th January - 1st February 2027. Workshops only or hotel packages. Pay in full, or €500 deposit today and monthly payments after.",
  path: "/book",
});

export default function BookIndexPage() {
  return (
    <>
    <ScenicBand src={SCENERY.phuketCoast.src} alt={SCENERY.phuketCoast.alt} />
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={eventJsonLd()} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Book", path: "/book" },
        ]}
      />
      <p className="mt-4 text-sm uppercase tracking-[0.18em] text-primary">{LIVE.heroDates}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{LIVE.bookHeading}</h1>
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
                  <td className="px-4 py-3">
                    <Link href={`/book/${pkg.slug}`} className="hover:text-primary hover:underline">
                      {pkg.title}
                    </Link>
                  </td>
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
          <article key={pkg.slug} className="overflow-hidden border border-border bg-card">
            <div className="relative h-56">
              <Image
                src={pkg.images[0]}
                alt={`${pkg.title} at Ayara Kamala Resort & Spa for the Phuket pole retreat`}
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
      <p className="mt-10 text-sm text-[#3e3e3e]">
        Questions before you book?{" "}
        <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
          Contact us on WhatsApp
        </Link>{" "}
        or read the{" "}
        <Link href="/faqs" className="text-primary underline-offset-4 hover:underline">
          FAQs
        </Link>
        .
      </p>
    </div>
    </>
  );
}
