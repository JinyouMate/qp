"use client";

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent className="leading-relaxed">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
