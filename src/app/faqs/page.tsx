import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { FAQS } from "@/lib/retreat";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Levels, packing, meals, sharing a room, and how to pay in full or with a €500 deposit and monthly payments for Phuket Pole Retreats 2027.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">Frequently asked questions</h1>
      <p className="mt-4 text-muted-foreground">
        Still stuck? Email or WhatsApp Tara and Jenny — they organise the retreat together.
      </p>
      <Accordion className="mt-10" defaultValue={["payments"]}>
        {FAQS.map((item, index) => (
          <AccordionItem key={item.q} value={index === 2 ? "payments" : `faq-${index}`}>
            <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
            <AccordionContent>
              <p>{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "mt-10 inline-flex h-11")}>
        Book now
      </Link>
    </div>
  );
}
