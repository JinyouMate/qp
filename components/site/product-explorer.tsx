"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

const TABS = [
  { value: "all", label: "全部" },
  { value: "traffic", label: "流量层 · 免费" },
  { value: "trust", label: "信任层 · 低门槛" },
  { value: "conversion", label: "转化层 · 付费" },
  { value: "delivery", label: "交付层 · 定制" },
] as const;

/**
 * 产品筛选器。
 * 传入 recommended 时：该身份该看的产品排到最前并打「为你推荐」标，
 * 顶部显示身份提示条 + 直接留资 / 取消筛选入口。
 */
export function ProductExplorer({
  products,
  recommended = [],
  roleLabel,
  leadHref,
}: {
  products: Product[];
  /** 推荐产品 slug，按优先级排列 */
  recommended?: string[];
  roleLabel?: string | null;
  leadHref?: string | null;
}) {
  const layers = ["traffic", "trust", "conversion", "delivery"] as const;
  const hasRole = Boolean(roleLabel && recommended.length > 0);

  const rank = (p: Product) => {
    const i = recommended.indexOf(p.slug);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const sorted = hasRole ? [...products].sort((a, b) => rank(a) - rank(b)) : products;

  const Grid = ({ items }: { items: Product[] }) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => {
        const rec = hasRole && recommended.includes(p.slug);
        return (
          <div key={p.id} className="relative h-full">
            {rec && (
              <span className="absolute -top-2.5 left-3 z-10 rounded-full bg-brand-orange px-2.5 py-0.5 text-[10px] font-bold text-white shadow-warm">
                为你推荐
              </span>
            )}
            <ProductCard product={p} />
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {hasRole && (
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-green/30 bg-brand-green-soft/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <span>
              已按「<b className="text-brand-green">{roleLabel}</b>」把该看的产品排到最前，
              带 <span className="rounded bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold text-white">为你推荐</span> 标的优先看。
            </span>
          </p>
          <div className="flex shrink-0 gap-2">
            {leadHref && (
              <Link
                href={leadHref}
                className="rounded-full bg-brand-red px-4 py-1.5 text-xs font-semibold text-white"
              >
                直接领资料
              </Link>
            )}
            <Link
              href="/products"
              className="rounded-full border bg-card px-4 py-1.5 text-xs font-medium"
            >
              取消筛选
            </Link>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="h-auto flex-wrap justify-center">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="mt-8">
          <Grid items={sorted} />
        </TabsContent>
        {layers.map((layer) => (
          <TabsContent key={layer} value={layer} className="mt-8">
            <Grid items={products.filter((p) => p.layer === layer)} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
