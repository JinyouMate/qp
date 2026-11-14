import Link from "next/link";
import { ArrowRight, Check, Database, ScanSearch, Store } from "lucide-react";

import { LIBRARIES, LIBRARY_ORDER, type Library, type Product } from "@/lib/types";
import { ProductIcon } from "./icon";
import { ProductCta } from "./product-cta";
import { WecomCtaButton } from "./wecom-dialog";

/** 板块主题色：数据库用品牌绿实心，其余两库用轻底 */
const THEME: Record<Library, { chip: string; ring: string; icon: string; accent: string }> = {
  kb: {
    chip: "bg-secondary text-primary",
    ring: "border-border bg-card",
    icon: "bg-secondary text-primary",
    accent: "text-primary",
  },
  tools: {
    chip: "bg-brand-orange-soft text-brand-orange-ink",
    ring: "border-border bg-card",
    icon: "bg-brand-orange-soft text-brand-orange-ink",
    accent: "text-brand-orange-ink",
  },
  data: {
    chip: "bg-white/15 text-white ring-1 ring-white/30",
    ring: "border-brand-green",
    icon: "bg-brand-green text-white",
    accent: "text-brand-green",
  },
  custom: {
    chip: "bg-brand-red-soft text-brand-red",
    ring: "border-border bg-card",
    icon: "bg-brand-red-soft text-brand-red",
    accent: "text-brand-red",
  },
};

/** 数据库板块要单独强调的三个硬指标 */
const DATA_POINTS = [
  { icon: Database, title: "312 万 SKU", desc: "底层商品与价格数据，按 OE 号 / 品牌 / 车型 / 毛利区间检索" },
  { icon: ScanSearch, title: "OE 号匹配", desc: "一条 OE 号反查适配车型、替代件与真实成交价带" },
  { icon: Store, title: "万家供货商评级", desc: "按交付、退货、报价稳定性给供货商打分，选货不再靠听说" },
];

function LibCard({ product, accent }: { product: Product; accent: string }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary`}>
          <ProductIcon name={product.icon} className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="block text-sm font-bold leading-snug underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{product.positioning}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed pt-3">
        <span className={`text-sm font-bold ${accent}`}>{product.price}</span>
        <ProductCta product={product} />
      </div>
    </article>
  );
}

export function LibrarySections({ products }: { products: Product[] }) {
  return (
    <div className="space-y-6">
      {LIBRARY_ORDER.map((key, index) => {
        const lib = LIBRARIES[key];
        const theme = THEME[key];
        const items = products.filter((p) => p.library === key);
        const isData = key === "data";

        return (
          <section key={key} id={`lib-${key}`} className="scroll-mt-24">
            <div
              className={
                isData
                  ? "relative overflow-hidden rounded-3xl border-2 border-brand-green bg-brand-green p-6 text-white shadow-warm ring-4 ring-brand-green/10 sm:p-8"
                  : `rounded-2xl border p-5 shadow-warm sm:p-6 ${theme.ring}`
              }
            >
              {isData && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
                />
              )}

              {/* 板块头 */}
              <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${theme.chip}`}
                >
                  0{index + 1}
                </span>
                <h2 className={`text-xl font-bold md:text-2xl ${isData ? "text-white" : ""}`}>
                  {lib.name}
                </h2>
                <span
                  className={`text-sm font-semibold ${isData ? "text-white/90" : theme.accent}`}
                >
                  {lib.tagline}
                </span>
                {isData && (
                  <span className="rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-bold text-white">
                    核心板块
                  </span>
                )}
                <span
                  className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${
                    isData
                      ? "bg-white text-brand-green"
                      : "bg-secondary text-primary"
                  }`}
                >
                  {isData ? "¥999 / 年" : lib.price}
                </span>
              </div>

              <p
                className={`relative mt-2 max-w-3xl text-sm leading-relaxed ${
                  isData ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {lib.note}
              </p>

              {isData ? (
                <>
                  <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
                    {DATA_POINTS.map((pt) => (
                      <div key={pt.title} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15">
                        <pt.icon className="h-5 w-5 text-white/90" strokeWidth={1.75} />
                        <p className="mt-2 text-base font-bold text-white">{pt.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/75">{pt.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-5 rounded-2xl bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-foreground">
                          {items[0]?.name ?? "金游™ 数据中台账号"}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {items[0]?.deliverable ??
                            "中控台 Client 只读账号（一人一号）+ 312 万 SKU 检索 + OE 号匹配 + 万家供货商评级"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-red">¥999</p>
                        <p className="text-xs text-muted-foreground">每年 · 一人一号</p>
                      </div>
                    </div>

                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {[
                        "312 万 SKU 无限次查询，不按条计费",
                        "OE 号反查适配与替代件，出结论有据可依",
                        "万家供货商评级，选货先看分数",
                        "网页端登录，开通当天可查",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-xs text-foreground/85">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                          {t}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {items[0] ? (
                        <ProductCta product={items[0]} variant="orange" />
                      ) : (
                        <WecomCtaButton
                          variant="orange"
                          label="开通中控台账号"
                          from="products-data"
                          subject="数据库"
                        />
                      )}
                      <Link
                        href="/products/data-subscription"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green underline-offset-4 hover:underline"
                      >
                        先看能查到什么 <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <LibCard key={p.id} product={p} accent={theme.accent} />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
