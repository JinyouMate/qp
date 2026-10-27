import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Package, Clock, RefreshCw,
  Users, AlertCircle, FileCheck2, Sparkles, ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductIcon } from "@/components/site/icon";
import { ProductCta } from "@/components/site/product-cta";
import { ProductCard } from "@/components/site/product-card";
import { PlanetNote } from "@/components/site/planet-note";
import { LeadSection } from "@/components/site/lead-section";
import { Faq } from "@/components/site/faq";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { buildMetadata } from "@/lib/seo";
import { FALLBACK_PRODUCTS } from "@/lib/data";
import { demandForProduct, getProductDetail, tierCompare } from "@/lib/product-detail";
import { LAYER_LABELS, TIERS, type Product } from "@/lib/types";

/* ============================================================
   产品详情模板  /products/[slug]
   - 全部产品共用一套模板，内容由 data + product-detail 推导
   - 18 个产品全部静态生成（generateStaticParams）
   - 每个产品独立 title / description / OG / Product 结构化数据
   ============================================================ */

const LAYER_BADGE: Record<string, string> = {
  traffic: "secondary",
  trust: "default",
  conversion: "accent",
  delivery: "destructive",
};

export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: "产品未找到" };

  return buildMetadata({
    title: product.name,
    description: `${product.positioning}。适合${product.audience}；解决：${product.problem}；交付：${product.deliverable}；${product.price}。`,
    path: `/products/${product.slug}`,
    ogImage: `/og/products-${product.slug}.png`,
    keywords: [product.name, TIERS[product.tier].name, LAYER_LABELS[product.layer].name],
  });
}

/** 同档位推荐（排除自己，最多 3 个） */
function siblings(product: Product): Product[] {
  return FALLBACK_PRODUCTS.filter(
    (p) => p.tier === product.tier && p.slug !== product.slug
  ).slice(0, 3);
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const detail = getProductDetail(product);
  const tier = TIERS[product.tier];
  const layer = LAYER_LABELS[product.layer];
  const compare = tierCompare(product.tier);
  const demand = demandForProduct(product);
  const recs = siblings(product);

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "首页", url: "/" },
            { name: "产品中心", url: "/products" },
            { name: product.name, url: `/products/${product.slug}` },
          ]),
        ]}
      />

      {/* ========== 面包屑 ========== */}
      <div className="border-b bg-brand-cream">
        <div className="container-site flex items-center gap-2 py-3 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">首页</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">产品中心</Link>
          <span>/</span>
          <span className="font-medium text-foreground">{product.name}</span>
        </div>
      </div>

      {/* ========== Hero：左文右粘性卡 ========== */}
      <section className="section-pad">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{tier.name}</Badge>
              <Badge variant={LAYER_BADGE[product.layer] as never}>{layer.name}</Badge>
              <span className="text-xs text-muted-foreground">{layer.goal}</span>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                <ProductIcon name={product.icon} className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.positioning}
                </p>
              </div>
            </div>

            {/* 三问快答 */}
            <dl className="mt-6 space-y-3 rounded-lg border bg-card p-4 sm:p-5">
              {[
                { icon: Users, label: "适合谁", value: product.audience },
                { icon: AlertCircle, label: "解决什么", value: product.problem },
                { icon: FileCheck2, label: "交付什么", value: product.deliverable },
              ].map((row) => (
                <div key={row.label} className="flex gap-3">
                  <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={1.5} />
                  <div>
                    <dt className="text-xs font-semibold text-muted-foreground">{row.label}</dt>
                    <dd className="text-sm leading-relaxed">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ProductCta product={product} size="default" />
              <Button asChild variant="outline">
                <Link href={`/contact?demand=${encodeURIComponent(demand)}&intent=wechat`}>
                  加企微先问清楚
                </Link>
              </Button>
            </div>

            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
              本站不收款、不做支付。加入与内容查阅在
              {product.third_party_platform ?? "知识星球"}完成，官网只做说明、留资与跳转。
            </p>
            {product.cta_type === "buy" && (
              <PlanetNote platform={product.third_party_platform} className="mt-2" />
            )}
          </div>

          {/* 粘性参数卡 */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader className="pb-3">
                <div className="text-xs text-muted-foreground">怎么收费</div>
                <div className="text-2xl font-bold text-brand-red">{product.price}</div>
                <p className="text-xs text-muted-foreground">{tier.range} · {tier.goal}</p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <dl className="space-y-3">
                  {[
                    { icon: Package, k: "交付形式", v: detail.form },
                    { icon: Clock, k: "见效周期", v: detail.timeline },
                    { icon: RefreshCw, k: "更新频率", v: detail.update },
                    { icon: Sparkles, k: "交付平台", v: product.third_party_platform ?? "站内交付" },
                  ].map((row) => (
                    <div key={row.k} className="flex gap-2">
                      <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" strokeWidth={1.5} />
                      <div>
                        <dt className="text-xs text-muted-foreground">{row.k}</dt>
                        <dd>{row.v}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="space-y-2.5 border-t border-dashed pt-4">
                  <ProductCta product={product} size="default" />
                  {product.cta_type === "buy" && (
                    <PlanetNote platform={product.third_party_platform} />
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* ========== 正文五段 ========== */}
      <section className="section-pad bg-brand-cream">
        <div className="container-site max-w-3xl space-y-10">
          {/* 1 场景痛点 */}
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">你会遇到这些情况吗</h2>
            <ul className="mt-4 space-y-3">
              {detail.pains.map((p) => (
                <li key={p} className="flex gap-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" strokeWidth={1.5} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* 2 交付清单 */}
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">拿到手是什么</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {detail.checklist.map((c) => (
                <li key={c} className="flex gap-2 rounded-lg border bg-card p-4 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={1.5} />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* 3 怎么用 */}
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">怎么用</h2>
            <ol className="mt-4 space-y-4">
              {detail.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed">{s}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* 4 档位对比 */}
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">和其他档位怎么选</h2>
            <div className="mt-4 overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">档位</th>
                    <th className="px-4 py-3 font-semibold">价格带</th>
                    <th className="px-4 py-3 font-semibold">适合什么时候</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.lower && (
                    <tr className="border-t">
                      <td className="px-4 py-3 text-muted-foreground">{compare.lower}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {Object.values(TIERS).find((t) => t.name === compare.lower)?.range}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">先试试看，判断我们靠不靠谱</td>
                    </tr>
                  )}
                  <tr className="border-t bg-brand-orange-soft">
                    <td className="px-4 py-3 font-bold">{compare.current}（本产品）</td>
                    <td className="px-4 py-3 font-bold text-brand-red">{tier.range}</td>
                    <td className="px-4 py-3">{tier.goal}</td>
                  </tr>
                  {compare.higher && (
                    <tr className="border-t">
                      <td className="px-4 py-3 text-muted-foreground">{compare.higher}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {Object.values(TIERS).find((t) => t.name === compare.higher)?.range}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">问题更具体、需要人陪着做</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5 FAQ */}
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">关于这个产品，常问的几件事</h2>
            <div className="mt-4">
              <Faq items={detail.faqs.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== 方法论信任补充 ========== */}
      <section className="section-pad">
        <div className="container-site">
          <div className="rounded-lg border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-bold">我们的数据怎么来的：汽配数据三层校验法</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { t: "第一层 · 交叉验证", d: "多源比对，冲突项不合并、先打标存疑。" },
                { t: "第二层 · 一线回测", d: "拿到真实场景跑一遍，实测结果回填记录。" },
                { t: "第三层 · 专家复核", d: "老师傅终审，过不了的不对外发布。" },
              ].map((s) => (
                <div key={s.t} className="rounded-md bg-brand-green-soft p-4">
                  <div className="text-sm font-bold text-brand-green">{s.t}</div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/80">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              任何一条数据没过完这三层，我们不会把它放进产品里。
            </p>
          </div>
        </div>
      </section>

      {/* ========== 同级推荐 ========== */}
      {recs.length > 0 && (
        <section className="section-pad bg-brand-cream">
          <div className="container-site">
            <h2 className="text-xl font-bold sm:text-2xl">同档位的其他选择</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recs.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== 留资收口 ========== */}
      <LeadSection
        title={`想要「${product.name}」？先留个联系方式`}
        desc="留资后我们按你的身份给一份使用建议，不合适会直接告诉你。"
        defaultDemand={demand}
      />

      <div className="container-site pb-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> 返回产品中心
        </Link>
        <span className="mx-3 text-muted-foreground">·</span>
        <Link href="/cases" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          看看别人怎么用 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
