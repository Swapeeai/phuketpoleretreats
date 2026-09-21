import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { PackageGallery } from "@/components/package-gallery";
import { Badge } from "@/components/ui/badge";
import { formatEur } from "@/lib/format";
import { getPackage, PACKAGES } from "@/lib/retreat";

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
  return {
    title: `Book ${pkg.title}`,
    description: `${pkg.description} From ${formatEur(pkg.fromCents)}. Pay in full, or €500 deposit today and monthly payments after.`,
    alternates: { canonical: `/book/${pkg.slug}` },
  };
}

export default async function PackagePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { checkout } = await searchParams;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p className="text-sm">
          <Link href="/book" className="text-muted-foreground hover:text-foreground">
            ← All packages
          </Link>
        </p>
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
      </div>
      <div className="border border-border bg-white p-5 sm:p-6">
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
