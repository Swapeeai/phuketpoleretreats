import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PackageGallery } from "@/components/package-gallery";
import { Badge } from "@/components/ui/badge";
import { formatEur } from "@/lib/format";
import { ALL_PACKAGES, getPackage } from "@/lib/retreat";
import { canonicalUrl, offerJsonLd, pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkout?: string }>;
};

export function generateStaticParams() {
  return ALL_PACKAGES.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Package not found" };
  if (pkg.hidden) {
    return {
      title: pkg.title,
      description: pkg.description,
      robots: { index: false, follow: false },
      alternates: { canonical: canonicalUrl(`/book/${pkg.slug}`) },
    };
  }
  const seo = PACKAGE_SEO[pkg.slug];
  return pageMetadata({
    title: seo?.title ?? `${pkg.title} Pole Retreat`,
    description:
      seo?.description ??
      `${pkg.description} Pole training week at Ayara Kamala, Phuket, 28 January–1 February 2027. From ${formatEur(pkg.fromCents)}.`,
    path: `/book/${pkg.slug}`,
  });
}

const PACKAGE_SEO: Record<string, { title: string; description: string }> = {
  "workshops-only": {
    title: "Workshops Only Pole Camp in Phuket",
    description:
      "Workshops-only place on the pole retreat in Phuket. 12 hours at Ayara Kamala, 28 January–1 February 2027, from €850. You arrange your own stay.",
  },
  "deluxe-ocean-view": {
    title: "Deluxe Ocean View Pole Retreat",
    description:
      "Deluxe Ocean View at the Ayara Kamala pole retreat — six nights and the Phuket pole training week, 28 January–1 February 2027, from €1,400.",
  },
  "grand-thai-natural": {
    title: "Grand Thai Natural Ocean View Stay",
    description:
      "Grand Thai Natural room at the Ayara Kamala pole retreat in Phuket. Spa bath, six nights, and the 2027 pole training week. From €1,475.",
  },
  "deluxe-pool-access": {
    title: "Pool Access Room at Ayara Kamala",
    description:
      "63sqm pool-access room for the pole camp in Phuket. Six nights at Ayara Kamala plus the intermediate, advanced and pro training week. From €1,525.",
  },
  "grand-thai-private-pool": {
    title: "Private Pool Suite, Phuket Pole Retreat",
    description:
      "Grand Thai suite with a private pool at the Ayara Kamala pole retreat. Six nights and the 2027 pole training week in Phuket. From €1,725.",
  },
};

export default async function PackagePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { checkout } = await searchParams;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
      {pkg.hidden ? null : <JsonLd data={offerJsonLd(pkg)} />}
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
          {pkg.fullPaymentOnly
            ? "Pay in full today."
            : "Pay in full, or €500 deposit today and monthly payments after."}
        </p>
        <div className="mt-6">
          <BookingForm pkg={pkg} cancelled={checkout === "cancelled"} />
        </div>
      </div>
    </div>
  );
}
