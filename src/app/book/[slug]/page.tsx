import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PackageGallery } from "@/components/package-gallery";
import { Badge } from "@/components/ui/badge";
import { formatEur } from "@/lib/format";
import { getPackage, PACKAGES } from "@/lib/retreat";
import { offerJsonLd, pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkout?: string }>;
};

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Package not found" };
  return pageMetadata({
    title: `Book ${pkg.title} — Phuket pole training week`,
    description: `${pkg.description} From ${formatEur(pkg.fromCents)}. Pole Art Retreat at Ayara Kamala, 28 January–1 February 2027. Pay in full, or €500 deposit today and monthly payments after.`,
    path: `/book/${pkg.slug}`,
    image: pkg.images[0],
    imageAlt: `${pkg.title} at Ayara Kamala Resort & Spa for the Phuket pole retreat`,
  });
}

export default async function PackagePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { checkout } = await searchParams;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
      <JsonLd data={offerJsonLd(pkg)} />
      <div>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Book", path: "/book" },
            { name: pkg.title, path: `/book/${pkg.slug}` },
          ]}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl">{pkg.title}</h1>
          <Badge variant="secondary">from {formatEur(pkg.fromCents)}</Badge>
        </div>
        <p className="mt-3 text-muted-foreground">{pkg.description}</p>
        <div className="mt-6">
          <PackageGallery title={pkg.title} images={pkg.images} />
        </div>
        <h2 className="mt-8 text-2xl">What’s included</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {pkg.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {pkg.notes?.map((note) => (
          <p key={note} className="mt-3 text-sm text-muted-foreground">
            {note}
          </p>
        ))}
        <p className="mt-6 text-sm text-[#3e3e3e]">
          Need a hand choosing?{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact us on WhatsApp
          </Link>
          .
        </p>
      </div>
      <div className="border border-border bg-card p-5 sm:p-6">
        <h2 className="text-2xl">Reserve your spot</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#272727]">
          Pay in full, or €500 deposit today and monthly payments after.
        </p>
        <div className="mt-6">
          <BookingForm pkg={pkg} cancelled={checkout === "cancelled"} />
        </div>
      </div>
    </div>
  );
}
