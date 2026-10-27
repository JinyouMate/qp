"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { LeadForm } from "./lead-form";
import { Card, CardContent } from "@/components/ui/card";

const INTENT_TITLE: Record<string, string> = {
  asset: "领取资料",
  consult: "预约咨询",
  buy: "购买前留资",
};

/** 读取 URL 参数，自动预填身份与需求（深链来自首页入口卡 / 产品 CTA） */
function Inner() {
  const sp = useSearchParams();
  const role = sp.get("role") ?? undefined;
  const demand = sp.get("demand") ?? undefined;
  const intent = sp.get("intent") ?? "";

  return (
    <Card>
      <CardContent className="p-6">
        {intent && INTENT_TITLE[intent] && (
          <div className="mb-4 inline-block rounded-full bg-brand-red-soft px-3 py-1 text-xs font-semibold text-brand-red">
            {INTENT_TITLE[intent]}
          </div>
        )}
        <LeadForm variant="full" defaultRole={role} defaultDemand={demand} />
      </CardContent>
    </Card>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
      <Inner />
    </Suspense>
  );
}
