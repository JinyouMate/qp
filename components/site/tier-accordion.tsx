"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCta } from "./product-cta";
import { TIERS, TIER_ORDER, type Product, type Tier } from "@/lib/types";
import { cn } from "@/lib/utils";

/* 折叠态只留一句话目标：不铺开长描述，避免首屏信息噪音 */
const ONE_LINER: Record<Tier, string> = {
  free: "先用免费清单，把问题解决一次",
  toolkit: "把 SOP 做成能填、能算的表格工具",
  subscription: "拿到 312 万条数据的查询权",
  enterprise: "按你的业务定制，从诊断到陪跑",
};

const TIER_BADGE: Record<Tier, string> = {
  free: "bg-secondary text-primary",
  toolkit: "bg-brand-orange text-white",
  subscription: "bg-brand-green-soft text-brand-green",
  enterprise: "bg-brand-red-soft text-brand-red",
};

/**
 * 产品中心四档手风琴。
 * - 默认只展开第 2 档（工具包），并用橙色高亮，作为唯一视觉焦点
 * - 折叠态：档位标题 + 一句话目标 + 价格锚点
 * - 展开态：PC 2 列 / 移动端 1 列的精简产品卡
 * - 从首页身份入口进来时，推荐产品排前并打「为你推荐」标（不新增卡片）
 */
export function TierAccordion({
  products,
  recommended = [],
  roleLabel,
}: {
  products: Product[];
  /** 身份推荐产品 slug，按优先级排列 */
  recommended?: string[];
  roleLabel?: string | null;
}) {
  const [value, setValue] = useState("toolkit");

  /* 兼容 /products#tier-xxx 直达：自动展开对应档位 */
  useEffect(() => {
    const hash = window.location.hash.replace("#tier-", "");
    if ((TIER_ORDER as readonly string[]).includes(hash)) setValue(hash);
  }, []);

  const hasRole = Boolean(roleLabel && recommended.length > 0);
  const rank = (p: Product) => {
    const i = recommended.indexOf(p.slug);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
      className="space-y-4"
    >
      {TIER_ORDER.map((tier, i) => {
        const all = products.filter((p) => p.tier === tier);

        const items = hasRole ? [...all].sort((a, b) => rank(a) - rank(b)) : all;
        const featured = tier === "toolkit";
        const open = value === tier;

        return (
          <AccordionItem
            key={tier}
            value={tier}
            id={`tier-${tier}`}
            className={cn(
              "scroll-mt-20 overflow-hidden rounded-2xl border bg-card px-0 transition-shadow",
              featured
                ? "border-brand-orange/50 shadow-sun"
                : "border-border shadow-warm"
            )}
          >
            <AccordionTrigger
              className={cn(
                "px-5 py-4 hover:no-underline sm:px-6 sm:py-5",
                featured &&
                  "bg-brand-orange-soft/70 [&>svg]:text-brand-orange"
              )}
            >
              <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 sm:flex-nowrap sm:gap-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
                      TIER_BADGE[tier]
                    )}
                  >
                    第 {i + 1} 档
                  </span>
                  <span className="text-base font-bold md:text-lg">{TIERS[tier].name}</span>
                </div>

                <p className="order-3 w-full text-xs leading-relaxed text-muted-foreground sm:order-none sm:w-auto sm:flex-1 sm:text-sm">
                  {ONE_LINER[tier]}
                </p>

                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    featured
                      ? "bg-brand-orange-soft text-brand-orange-ink ring-1 ring-brand-orange/25"
                      : "bg-secondary text-primary"
                  )}
                >
                  {TIERS[tier].range}
                </span>

                <span
                  className={cn(
                    "hidden shrink-0 text-xs lg:inline",
                    featured ? "font-semibold text-brand-orange-ink" : "text-muted-foreground"
                  )}
                >
                  {open ? "收起" : "展开"}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-6 sm:px-6">
              {featured && (
                <p className="mb-5 text-xs font-medium text-brand-orange-ink">
                  多数人从这里开始：先把一个具体问题做通，用得上再往上走。
                </p>
              )}
              <div className="grid gap-5 md:grid-cols-2">
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed bg-secondary/40 p-5 text-sm md:col-span-2">
                    <p className="font-semibold">这一档正在整理上线</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {TIERS[tier].note}
                    </p>
                    <Link
                      href="/contact"
                      className="mt-3 inline-block text-xs font-semibold text-brand-green underline-offset-4 hover:underline"
                    >
                      直接问主理人 →
                    </Link>
                  </div>
                )}
                {items.map((p) => {
                  const rec = hasRole && recommended.includes(p.slug);
                  return (
                    <article
                      key={p.id}
                      className="flex flex-col gap-2.5 rounded-xl border bg-card p-5 text-foreground transition-shadow hover:shadow-warm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-sm font-bold leading-snug underline-offset-4 hover:underline"
                        >
                          {p.name}
                        </Link>
                        {rec && (
                          <span className="shrink-0 rounded-full bg-brand-green-soft px-2 py-0.5 text-[11px] font-semibold text-brand-green">
                            为你推荐
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed">{p.problem}</p>
                      <p className="text-xs text-muted-foreground">适合：{p.audience}</p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed pt-3">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            featured ? "text-brand-orange-ink" : "text-foreground"
                          )}
                        >
                          {p.price}
                        </span>
                        <ProductCta
                          product={p}
                          variant={featured ? "orange" : "outline"}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
