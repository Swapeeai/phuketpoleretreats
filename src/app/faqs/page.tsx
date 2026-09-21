import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { buttonVariants } from "@/components/ui/button";
import { FAQS } from "@/lib/retreat";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "FAQs for the Phuket pole camp",
  description:
    "Questions about the Phuket Pole Art Retreat: intermediate, advanced and pro groups, 12 hours of workshops, hotel packages at Ayara Kamala, and paying in full or with a €500 deposit.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "FAQs", path: "/faqs" },
        ]}
      />
      <h1 className="mt-4 text-4xl sm:text-5xl">Frequently asked questions</h1>
      <p className="mt-4 text-base leading-relaxed text-[#272727]">
        Levels, packing, rooms, meals, and booking for this pole training week in Phuket. Still
        stuck?{" "}
        <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
          Message Tara and Jenny on WhatsApp
        </Link>
        .
      </p>
      <FaqList faqs={FAQS} />
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6")}>
          Book now
        </Link>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-6")}
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
