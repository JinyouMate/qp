"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WecomDialog } from "./wecom-dialog";
import { WecomNote } from "./wecom-note";
import { trackEvent } from "@/lib/analytics";
import { WECOM } from "@/lib/brand";
import type { Product } from "@/lib/types";

/* ============================================================
   产品下一步动作（CTA）

   铁律（2026-11-12 全站封板）：
   1. 不跳转任何外部链接，官网不接支付、不做第三方平台跳转
   2. 全站只有一个转化动作：点击弹主理人企微名片
   3. 不再区分 consult / claim / buy，也不再有任何站内表单页跳转
   ============================================================ */

export function ProductCta({
  product,
  size = "sm",
  label,
  variant = "orange",
}: {
  product: Product;
  size?: "sm" | "default" | "lg";
  /** 覆盖按钮文案（默认全站统一 CTA） */
  label?: string;
  /** 主行动色 orange（默认）/ 次级样式 outline；产品中心按档位区分主次 */
  variant?: "orange" | "outline";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} variant={variant} onClick={() => setOpen(true)}>
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
