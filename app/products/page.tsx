import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata, KEYWORDS } from "@/lib/seo";

import { PageHero } from "@/components/site/page-hero";
import { LibrarySections } from "@/components/site/library-sections";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { getProducts } from "@/lib/data";
import { getPersona } from "@/lib/persona";
import { WecomCtaButton } from "@/components/site/wecom-dialog";

// Cloudflare Pages：该页读取 searchParams（?role=），属动态路由，必须跑 Edge Runtime
export const runtime = "edge";

export const metadata: Metadata = buildMetadata({
  title: "服务目录",
  description:
    "三库商业矩阵：知识库（免费 / ¥9.9 引流，构建行业认知）→ 工具库（¥99 – ¥299，现成工具直接落地）→ 数据库（¥999 / 年，开通中控台专属账号，看透真实利润）。",
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
            { name: "服务目录", url: "/products" },
          ]),
        ]}
      />

      <PageHero
        tag="CATALOG"
        title="服务目录：知识库、工具库、数据库"
        desc="三层资产，缺什么补什么：先用知识库把行业看明白，再用工具库把动作做出结果，最后用数据库看透自己的真实利润。"
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

      {/* 三库：知识库 → 工具库 → 数据库（数据库视觉权重最高） */}
      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-5xl">
            <LibrarySections products={products} />
          </div>
        </div>
      </section>

      {/* 定制合作：不占三库板块，单独一条出口 */}
      <section className="pb-16">
        <div className="container-site">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-dashed bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <b className="text-foreground">三库解决不了的问题？</b>
              按你的业务做定制：基于 312 万条数据的诊断、方案与陪跑，以及 SaaS 与 AI 数据合作。
            </p>
            <div className="flex shrink-0 gap-2 text-sm font-semibold">
              <Link
                href="/consulting"
                className="rounded-full border bg-card px-4 py-2 transition-colors hover:border-brand-green hover:text-brand-green"
              >
                定制咨询
              </Link>
              <Link
                href="/partners"
                className="rounded-full border bg-card px-4 py-2 transition-colors hover:border-brand-green hover:text-brand-green"
              >
                SaaS / AI 合作
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
