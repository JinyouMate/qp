import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "知识库与SOP",
  description: "12,000+ 条目的汽配基础知识库（名词库/适配库/政策库/避坑库）+ 6 套可打印照做的 SOP 清单 + 一线在用的表格模板。",
  path: "/knowledge",
  keywords: [KEYWORDS.knowledge, KEYWORDS.sop, KEYWORDS.data, KEYWORDS.oe, KEYWORDS.vin],
});

const MODULES = [
  {
    name: "名词库",
    desc: "把行业黑话翻成人话。OE 号、适配、副厂、拆车件、总成……每个词都给定义、用法和容易混淆的点。",
    count: "3,200+ 条",
  },
  {
    name: "适配库",
    desc: "车型—配件—OE 号的对应关系，标注数据来源与校验层级。存疑条目明确标红，不装作确定。",
    count: "6,500+ 条",
  },
  {
    name: "政策库",
    desc: "各平台汽配类目规则、跨境合规要求、资质与认证清单，标注生效时间与官方出处。",
    count: "900+ 条",
  },
  {
    name: "避坑库",
    desc: "真实赔过钱的案例：哪些货不能进、哪些话术会招投诉、哪些平台规则会直接罚款。",
    count: "1,400+ 条",
  },
];

const SOPS = [
  { name: "《选品 SOP》", steps: "五维评分 → 测款流程 → 复盘标准", use: "每周选品会照着走一遍" },
  { name: "《平台入驻 SOP》", steps: "资质清单 → 类目选择 → 首月动作", use: "开新店/新平台前逐项打勾" },
  { name: "《报价核价 SOP》", steps: "成本构成 → 汇率折算 → 毛利校验", use: "每次定价前过一遍，避免卖一单亏一单" },
  { name: "《供应商分级 SOP》", steps: "评估维度 → 分级标准 → 淘汰机制", use: "季度复盘供应商时用" },
  { name: "《库存周转 SOP》", steps: "安全库存 → 滞销分级 → 渠道分流", use: "每月盘库时用" },
  { name: "《客服话术 SOP》", steps: "适配核实 → 异议处理 → 退货判定", use: "新客服第一天就能上手" },
];

export default async function KnowledgePage() {
  const products = await getProducts();
  const items = products.filter((p) => p.category === "knowledge");

  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "知识库与SOP", url: "/knowledge" },
        ])}
      />

      <PageHero
        tag="KNOWLEDGE & SOP"
        title="知识库与 SOP：把「师傅脑子里的东西」变成文件"
        desc="新人不用等老师傅带，老人不用靠记忆。查得到、打印出来就能照着做。"
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="destructive">
            <Link href="/contact?intent=asset&demand=SOP">免费领 SOP 清单</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#sop-list">看 6 套 SOP 目录</Link>
          </Button>
        </div>
      </PageHero>

      {/* 知识库四板块 */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading
            tag="知识库"
            title="四个板块，覆盖你日常会查的东西"
            desc="在线查阅（Baklib / 飞书），基础版免费开放，进阶版随社群。"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <Card key={m.name} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">{m.name}</h3>
                    <Badge variant="secondary">{m.count}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOP 清单 */}
      <section id="sop-list" className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading
            tag="SOP 清单"
            title="打印出来贴在工位上，就能照着做"
            desc="每套 SOP 都是一页纸：步骤、判断标准、谁负责、做完怎么验收。"
          />
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">SOP</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">关键步骤</th>
                  <th className="px-4 py-3 font-semibold">什么时候用</th>
                </tr>
              </thead>
              <tbody>
                {SOPS.map((s) => (
                  <tr key={s.name} className="border-t">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{s.name}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{s.steps}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 产品卡 */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="相关产品" title="知识库与 SOP 相关产品" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Card key={p.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <h3 className="text-base font-bold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.positioning}</p>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-muted-foreground">适合谁</dt>
                      <dd>{p.audience}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-muted-foreground">交付什么</dt>
                      <dd>{p.deliverable}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto flex items-center justify-between border-t border-dashed pt-3">
                    <span className="text-sm font-bold text-brand-red">{p.price}</span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/contact?intent=asset&demand=SOP`}>
                        免费领取 <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            知识库在线查阅在 Baklib / 飞书，加企微后由我们开通权限（官网不处理支付）
          </p>
        </div>
      </section>

      <LeadSection defaultDemand="SOP" title="留个联系方式，6 套 SOP + 模板库一起发你" />
    </>
  );
}
