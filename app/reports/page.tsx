import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight, ExternalLink, LineChart, FileText, Table2 } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCta } from "@/components/site/product-cta";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "报告与数据产品",
  description: "行业报告（品类数据、价格带、竞争格局、趋势预判）与订阅数据产品（价格监测、跨平台销量追踪、竞品动态周报），支持 7 天试用。",
  path: "/reports",
  keywords: [KEYWORDS.data, KEYWORDS.nev, KEYWORDS.compliance, KEYWORDS.oe],
});

const REPORTS = [
  {
    name: "《中国汽配电商价格带全景 2026》",
    metric: "覆盖 12 个主流品类 · 4 个平台",
    desc: "每个品类的成交价格带分布、头部集中度、低价区陷阱，附选品价格定位建议。",
    price: "¥1,299",
  },
  {
    name: "《跨境汽配（Ozon / eBay / Temu）机会地图》",
    metric: "3 平台 · 9 个高潜品类",
    desc: "真实成交数据拆毛利结构：汇率、物流、佣金、退货，算清楚到手多少钱。",
    price: "¥1,999",
  },
  {
    name: "《修理厂采购渠道现状调研》",
    metric: "217 份有效样本 · 6 省",
    desc: "修理厂从哪进货、为什么换供应商、对账期和适配准确率的真实要求。",
    price: "¥899",
  },
];

const DATA_FEATURES = [
  { icon: LineChart, title: "品类价格监测", desc: "主流平台核心品类价格波动，周更，异常波动单独标注。" },
  { icon: Table2, title: "跨平台销量追踪", desc: "同一 SKU 在不同平台的表现对照，口径统一后再比。" },
  { icon: FileText, title: "竞品动态周报", desc: "新品、调价、活动、评价变化，每周一封，附判断。" },
];

const METHOD = [
  "口径写清楚：每个数字都注明统计区间、样本量与来源平台，不含「约」「差不多」。",
  "存疑必标注：交叉验证对不上的数据不进报告，宁可少一个数。",
  "结论给动作：每份报告结尾是「所以你该做什么」，不是「未来可期」。",
];

export default async function ReportsPage() {
  const products = await getProducts();
  const reportItems = products.filter((p) => p.category === "reports");
  const full = reportItems.find((p) => p.slug === "full-reports");
  const brief = reportItems.find((p) => p.slug === "report-briefs");
  const sub = reportItems.find((p) => p.slug === "data-subscription");

  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "报告与数据产品", url: "/reports" },
        ])}
      />

      <PageHero
        tag="REPORTS & DATA"
        title="决策要有依据，别再用拍脑袋交学费"
        desc="报告给结论与动作，数据产品给持续盯盘的能力。两者都可以先看摘要，再决定要不要买。"
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="destructive">
            <Link href="/contact?intent=asset&demand=%E6%8A%A5%E5%91%8A">免费领报告摘要</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact?intent=consult&demand=%E6%95%B0%E6%8D%AE%E4%BA%A7%E5%93%81">申请 7 天试用</Link>
          </Button>
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="行业报告" title="每份报告都写清口径、样本和动作" />
          <div className="grid gap-4 md:grid-cols-3">
            {REPORTS.map((r) => (
              <Card key={r.name} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <Badge variant="accent" className="w-fit">{r.metric}</Badge>
                  <h3 className="text-base font-bold leading-snug">{r.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-dashed pt-3">
                    <span className="text-lg font-bold text-brand-red">{r.price}</span>
                    {full && <ProductCta product={full} />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {brief && (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-xl bg-brand-green-soft p-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-sm">
                <span className="font-bold">不想先花钱？</span>每份报告都有精华摘要版：核心数据 + 趋势判断 + 一页决策建议，免费领。
              </p>
              <Button asChild variant="default" size="sm">
                <Link href="/contact?intent=asset&demand=%E6%8A%A5%E5%91%8A">
                  领摘要 <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="订阅数据产品" title="盯盘这件事，交给看板" desc="飞书多维表格 / 看板交付，周更，支持 7 天试用。" />
          <div className="grid gap-4 md:grid-cols-3">
            {DATA_FEATURES.map((f) => (
              <Card key={f.title}>
                <CardContent className="flex gap-3 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <f.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {sub && (
            <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:justify-between">
              <div>
                <p className="font-semibold">订阅数据产品 · ¥699 起 / 月</p>
                <p className="text-xs text-muted-foreground">含 7 天试用，不满意直接停，不自动续费。</p>
              </div>
              <ProductCta product={sub} />
            </div>
          )}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="我们的数据原则" title="数据可以错一次，口径不能含糊一次" />
          <div className="mx-auto max-w-3xl space-y-3">
            {METHOD.map((m) => (
              <div key={m} className="flex gap-3 rounded-xl border bg-card p-4 text-sm leading-relaxed">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                {m}
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            报告与数据在飞书交付，官网不处理支付；所有第三方链接均附加来源参数。
          </p>
        </div>
      </section>

      <LeadSection defaultDemand="报告" title="免费领报告摘要 + 申请 7 天试用" />
    </>
  );
}
