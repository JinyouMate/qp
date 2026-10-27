"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThirdPartyGate } from "./third-party-gate";
import { PlanetDialog } from "./planet-dialog";
import { PlanetNote } from "./planet-note";
import { TrackedLink } from "./tracked-link";
import { trackEvent } from "@/lib/analytics";
import { demandForProduct } from "@/lib/product-detail";
import { PLANET } from "@/lib/brand";
import type { Product } from "@/lib/types";

/**
 * 产品下一步动作（CTA）：
 * - claim   免费领取 → 留资后发资料
 * - consult 预约咨询 → 联系页留资（预选咨询）
 * - buy     加入知识星球 → 先弹留资窗，再下发【复制星球链接】/【加企微】
 *
 * 注意：本项目**不做任何站内支付与收银台**，成交与交付全部在知识星球完成。
 */
export function ProductCta({
  product,
  size = "sm",
  label,
}: {
  product: Product;
  size?: "sm" | "default" | "lg";
  /** 覆盖按钮文案（默认：小按钮「获取星球入口」，大按钮「加入知识星球」） */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const demand = demandForProduct(product);

  if (product.cta_type === "claim") {
    return (
      <Button asChild size={size} variant="outline">
        <TrackedLink
          href={`/contact?demand=${encodeURIComponent(demand)}&intent=asset`}
          event="asset_download"
          data={{ from: "product", product: product.slug, tier: product.tier }}
        >
          免费领取 <ArrowRight />
        </TrackedLink>
      </Button>
    );
  }

  if (product.cta_type === "consult") {
    return (
      <Button asChild size={size} variant="destructive">
        <TrackedLink
          href={`/contact?demand=${encodeURIComponent(demand)}&intent=consult`}
          event="consult_click"
          data={{ from: "product", product: product.slug, tier: product.tier }}
        >
          预约咨询 <ArrowRight />
        </TrackedLink>
      </Button>
    );
  }

  // buy：先留资 → 再下发星球入口（复制链接 / 加企微），不直接跳转
  const text = label ?? (size === "sm" ? "获取星球入口" : `加入${PLANET.name}`);

  return (
    <>
      <Button
        size={size}
        variant="orange"
        onClick={() => {
          trackEvent("planet_join_intent", {
            stage: "intent",
            product: product.slug,
            platform: product.third_party_platform ?? PLANET.name,
            tier: product.tier,
          });
          setOpen(true);
        }}
      >
        {text} <ArrowRight />
      </Button>
      <PlanetDialog
        product={product}
        open={open}
        onOpenChange={setOpen}
        demand={demand}
      />
    </>
  );
}

/** 加入区下方的第三方平台声明小字（单独导出，详情页/卡片复用） */
export function BuyNote({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <PlanetNote
      platform={product.third_party_platform ?? PLANET.name}
      className={className}
    />
  );
}

/**
 * 通用第三方外链：点击前先过一次留资提示。
 * 用于平台入口表、账号矩阵等非产品卡的站外链接。
 */
export function ExternalLink({
  href,
  label,
  platform,
  demand,
  className,
}: {
  href: string | null;
  label: string;
  platform?: string;
  demand?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!href || href === "#") {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        }
      >
        {label} <ArrowUpRight className="h-3 w-3" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        }
      >
        {label} <ArrowUpRight className="h-3 w-3" />
      </button>
      <ThirdPartyGate
        open={open}
        onOpenChange={setOpen}
        url={href}
        title={`前往「${label}」`}
        platform={platform}
        demand={demand}
      />
    </>
  );
}
