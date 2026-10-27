"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WecomDialog } from "./wecom-dialog";
import { WecomNote } from "./wecom-note";
import { TrackedLink } from "./tracked-link";
import { trackEvent } from "@/lib/analytics";
import { WECOM } from "@/lib/brand";
import type { Product } from "@/lib/types";

/* ============================================================
   产品下一步动作（CTA）

   铁律（2026-10-27 改版）：
   1. **不跳转任何外部链接**，官网不接支付、不做第三方平台跳转
   2. claim / buy 一律弹企微二维码弹窗，文案统一【扫码加企微，获取内部资料库】
   3. consult 是唯一的站内例外：跳 /contact 留资（内部页面，写入 Supabase leads）
   ============================================================ */

export function ProductCta({
  product,
  size = "sm",
  label,
}: {
  product: Product;
  size?: "sm" | "default" | "lg";
  /** 覆盖按钮文案（默认全站统一 CTA） */
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  // 预约咨询：站内留资页（不弹窗、不跳外链）
  if (product.cta_type === "consult") {
    return (
      <Button asChild size={size} variant="destructive">
        <TrackedLink
          href={`/contact?intent=consult&subject=${encodeURIComponent(product.name)}`}
          event="consult_click"
          data={{ from: "product", product: product.slug, tier: product.tier }}
        >
          预约咨询 <ArrowRight />
        </TrackedLink>
      </Button>
    );
  }

  // claim（免费领取）/ buy：统一弹企微二维码，不跳转
  return (
    <>
      <Button size={size} variant="orange" onClick={() => setOpen(true)}>
        {label ?? WECOM.ctaLabel} <ArrowRight />
      </Button>
      <WecomDialog
        open={open}
        onOpenChange={setOpen}
        from={`product:${product.slug}`}
        subject={product.name}
      />
    </>
  );
}

/** 产品卡 / 详情页下方的交付声明小字 */
export function BuyNote({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return <WecomNote className={className} compact />;
}

/**
 * 通用触发按钮（原「第三方外链」）。
 * 现在不再持有任何 href：点击只弹企微二维码窗，避免任何站外跳转。
 */
export function ExternalLink({
  label,
  platform,
  demand,
  className,
}: {
  label?: string;
  platform?: string;
  demand?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent("wechat_click", {
            from: "external",
            platform: platform ?? "",
            demand: demand ?? "",
          });
          setOpen(true);
        }}
        className={
          className ??
          "inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        }
      >
        {label ?? WECOM.ctaLabel} <ArrowRight className="h-3 w-3" />
      </button>
      <WecomDialog
        open={open}
        onOpenChange={setOpen}
        from="external"
        subject={platform ?? demand ?? ""}
      />
    </>
  );
}
