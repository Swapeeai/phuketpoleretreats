import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/seo";

type Faq = { q: string; a: string };

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <Accordion className="mt-8 border-t border-border" defaultValue={["faq-0"]}>
        {faqs.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`}>
            <AccordionTrigger className="py-4 text-base font-medium">{item.q}</AccordionTrigger>
            <AccordionContent>
              <p className="text-[#272727]">{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
