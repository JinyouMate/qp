import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata, KEYWORDS } from "@/lib/seo";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ProductExplorer } from "@/components/site/product-explorer";
import { ProductLadder, LadderNav } from "@/components/site/product-ladder";
import { LeadSection } from "@/components/site/lead-section";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { getProducts } from "@/lib/data";
import { LAYER_LABELS, TIER_ORDER } from "@/lib/types";
import { getPersona, personaLeadHref } from "@/lib/persona";

export const metadata: Metadata = buildMetadata({
  title: "产品中心",
  description: "四档产品阶梯：免费内容 → 99-499 工具包 → 999-4999 课程/订阅 → 1万+ 咨询内训。每张卡片都写清：适合谁、解决什么问题、交付什么、怎么收费、下一步动作。",
  path: "/products",
  keywords: [KEYWORDS.data, KEYWORDS.oe, KEYWORDS.vin, KEYWORDS.knowledge, KEYWORDS.sop],
});

export default async function ProductsPage({
  searchParams,
}: {
  /** 首页四类入口跳进来时带 ?role=repair|dealer|enterprise|ai */
  searchParams?: { role?: string };
}) {
  const products = await getProducts();
  const persona = getPersona(searchParams?.role);

  return (
    <>
      {/* 结构化数据：每个产品一个 Product，外加面包屑 */}
      <JsonLd
        data={[
          ...products.map(productSchema),
          breadcrumbSchema([
            { name: "首页", url: "/" },
            { name: "产品中心", url: "/products" },
          ]),
        ]}
      />

      <PageHero
        tag="PRODUCTS"
        title="产品中心：从免费到定制，一次只上一档"
        desc="不用一次买全套。先用免费的清单把问题解决一次，用得上再往上走——工具包、课程体系、最后才是定制咨询。"
      />

      {/* 身份筛选提示条：从首页四类入口进来时展示 */}
      {persona && (
        <section className="border-b bg-brand-green-soft/70">
          <div className="container-site flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-green">
                已按「{persona.label}」为你排序 · {persona.need}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {persona.pain} → 你会拿到：{persona.give}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={personaLeadHref(persona)}
                className="rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-white"
              >
                {persona.intent === "consult" ? "预约沟通" : "领取资料"}
              </Link>
              <Link
                href="/products"
                className="rounded-full border bg-card px-4 py-2 text-xs font-medium"
              >
                取消筛选
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 阶梯导航 */}
      <section className="border-b bg-brand-cream py-8">
        <div className="container-site">
          <LadderNav products={products} />
        </div>
      </section>

      {/* 阶梯详情 */}
      {TIER_ORDER.map((tier) => {
        const items = products.filter((p) => p.tier === tier);
        if (items.length === 0) return null;
        return (
          <section
            key={tier}
            id={`tier-${tier}`}
            className="section-pad scroll-mt-20 border-b last:border-0"
          >
            <div className="container-site">
              <ProductLadder products={items} showFooter={tier === "enterprise"} />
            </div>
          </section>
        );
      })}

      {/* 另一个维度：按信任程度分层筛选 */}
      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading
            tag="换个维度"
            title="按你的信任程度筛选"
            desc="同一批产品，换个角度看：先免费试，再建信任，最后才谈付费与定制。"
          />
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(["traffic", "trust", "conversion", "delivery"] as const).map((l) => (
              <div key={l} className="rounded-xl border bg-card p-4">
                <div className="text-sm font-bold">{LAYER_LABELS[l].name}</div>
                <p className="mt-1 text-xs text-muted-foreground">{LAYER_LABELS[l].desc}</p>
                <p className="mt-2 text-xs font-semibold text-brand-orange">
                  目标：{LAYER_LABELS[l].goal}
                </p>
              </div>
            ))}
          </div>
          <ProductExplorer
            products={products}
            recommended={persona?.recommended ?? []}
            roleLabel={persona?.label ?? null}
            leadHref={persona ? personaLeadHref(persona) : null}
          />
        </div>
      </section>

      <LeadSection
        title="不确定选哪个？说清楚你的问题，我们帮你挑"
        desc="填一次表，我们按你的身份与问题推荐最合适的那一两样，不会推全部。"
      />
    </>
  );
}
