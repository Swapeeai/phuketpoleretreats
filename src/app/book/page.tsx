import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEur } from "@/lib/format";
import { PACKAGES, RETREAT } from "@/lib/retreat";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book the 2027 Phuket Pole Art Retreat",
  description:
    "Reserve workshops or a hotel package at Ayara Kamala, 28 January–1 February 2027. Pay in full on Stripe or pay a €500 deposit with automatic monthly installments.",
  alternates: { canonical: "/book" },
};

export default function BookIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.18em] text-primary">{RETREAT.headlineDates}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Book your spot</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Choose a package, then pay in full or put €500 down. Remaining balance is billed
        automatically by Stripe each month until it is paid — last charge by 28 November 2026, 60
        days before check-in. Bookings are non-refundable.
      </p>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {PACKAGES.map((pkg) => (
          <Card key={pkg.slug} className="overflow-hidden pt-0">
            <div className="relative h-56">
              <Image
                src={pkg.images[0]}
                alt={pkg.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                <Badge variant="secondary">from {formatEur(pkg.fromCents)}</Badge>
              </div>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pkg.includesHotel ? (
                <p className="text-sm text-muted-foreground">
                  Shared {formatEur(pkg.variants.find((v) => v.occupancy === "shared")!.priceCents)} ·
                  Solo {formatEur(pkg.variants.find((v) => v.occupancy === "solo")!.priceCents)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{formatEur(pkg.fromCents)} · no hotel</p>
              )}
              <Link href={`/book/${pkg.slug}`} className={cn(buttonVariants({ size: "lg" }), "h-10")}>
                Continue to booking
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
