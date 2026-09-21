import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import type { FaqItem } from "@/lib/retreat";
import { faqPageJsonLd } from "@/lib/seo";

export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <Accordion className="mt-8 border-t border-border" defaultValue={["faq-0"]}>
        {faqs.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`}>
            <AccordionTrigger className="py-4 text-base font-medium">{item.q}</AccordionTrigger>
            <AccordionContent>
              <p className="text-[#272727]">{item.a}</p>
              {item.image ? (
                <figure className="mt-4 overflow-hidden border border-border bg-muted">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                </figure>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
