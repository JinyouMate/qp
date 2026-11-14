import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata, KEYWORDS } from "@/lib/seo";

import { PageHero } from "@/components/site/page-hero";
import { TierAccordion } from "@/components/site/tier-accordion";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { getProducts } from "@/lib/data";
import { getPersona } from "@/lib/persona";
import { WecomCtaButton } from "@/components/site/wecom-dialog";

// Cloudflare Pages：该页读取 searchParams（?role=），属动态路由，必须跑 Edge Runtime
export const runtime = "edge";

export const metadata: Metadata = buildMetadata({
  title: "产品中心",
  description: "四档产品阶梯：免费内容 → 99-499 工具包 → 999-1999 数据订阅与会员 → 1万+ 定制合作。每张卡片都写清：适合谁、解决什么问题、交付什么、怎么收费、下一步动作。",
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
        desc="不用一次买全套。先用免费清单把问题解决一次，用得上再往上走：工具包 → 数据中台账号 → 定制咨询。"
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
              <WecomCtaButton
                size="sm"
                variant="orange"
                label="联系主理人"
                from="products-persona"
                subject={persona.label}
                className="rounded-full px-4 py-2 text-xs font-semibold"
              />
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

      {/* 四档产品阶梯：手风琴折叠，默认只展开第 2 档（工具包） */}
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-5xl">
            <TierAccordion
              products={products}
              recommended={persona?.recommended ?? []}
              roleLabel={persona?.label ?? null}
            />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              不确定从哪一档开始？先用免费的清单把问题解决一次，用得上再往上走。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
