import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight, Wrench, Bot, ShieldCheck, FileSignature } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "SaaS与AI合作",
  description: "面向 SaaS 团队的行业 Know-how 与种子用户合作，以及面向 AI 公司的汽配语料授权、标注规则与评测标准共建。签 DPA，合规先行。",
  path: "/partners",
  keywords: [KEYWORDS.ai, KEYWORDS.data, KEYWORDS.compliance, KEYWORDS.oe],
});

const AI_DELIVERABLES = [
  {
    name: "行业语料授权",
    desc: "汽配领域问答、适配关系、工单与话术语料，按用途与期限授权，可追溯、可撤回。",
    note: "签 DPA · 明确用途与删除机制",
  },
  {
    name: "标注规则输出",
    desc: "我们写清楚「什么算对」：适配判定规则、品类归属边界、歧义处理约定，配标注示例集。",
    note: "含质检抽样标准",
  },
  {
    name: "评测标准共建",
    desc: "和你一起搭垂直评测集，定义指标与难度分层，用真实业务问题做尺子，不拿通用榜单糊弄。",
    note: "可联合署名发布",
  },
  {
    name: "专家复核",
    desc: "5 年以上品类经验的工程师参与结果复核与错误归因，输出可操作的改进建议。",
    note: "按人天或按条目计费",
  },
];

const COMPLIANCE = [
  { icon: FileSignature, title: "先签协议再谈数据", desc: "正式合作协议 + 数据处理附录（DPA），明确用途、期限、转委托与删除机制。" },
  { icon: ShieldCheck, title: "原始数据不出域", desc: "客户名称、单号、成交价格等一律脱敏；需要原始数据时走授权审批，留痕可查。" },
  { icon: Wrench, title: "用途限定", desc: "授权只覆盖约定用途。换用途、转授权、再训练都要重新确认，不接受口头承诺。" },
];

export default async function PartnersPage() {
  const products = await getProducts();
  const items = products.filter((p) => p.category === "partners");

  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "SaaS与AI合作", url: "/partners" },
        ])}
      />

      <PageHero
        tag="PARTNERS"
        title="SaaS 与 AI 合作：我们出行业 Know-how，你出产品力"
        desc="工具做不好汽配，往往不是技术问题，是没人告诉他「什么算对」。这正是我们手里的东西。"
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="destructive">
            <Link href="/contact?intent=consult&demand=AI%E5%90%88%E4%BD%9C">AI 数据合作</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact?intent=consult&demand=SaaS">SaaS 合作</Link>
          </Button>
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="合作形态" title="两种合作，走两条路" />
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((p) => (
              <Card key={p.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      {p.slug === "ai-data" ? (
                        <Bot className="h-5 w-5" strokeWidth={1.75} />
                      ) : (
                        <Wrench className="h-5 w-5" strokeWidth={1.75} />
                      )}
                    </span>
                    <h3 className="text-base font-bold">{p.name}</h3>
                    <Badge variant="secondary" className="ml-auto">交付层</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.positioning}</p>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-muted-foreground">解决什么</dt>
                      <dd>{p.problem}</dd>
                    </div>
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
                    <Button asChild size="sm" variant="destructive">
                      <Link
                        href={`/contact?intent=consult&demand=${encodeURIComponent(
                          p.slug === "ai-data" ? "AI合作" : "SaaS"
                        )}`}
                      >
                        提交合作意向 <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="AI 合作能交付什么" title="四样东西，都可以单独谈" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {AI_DELIVERABLES.map((d) => (
              <Card key={d.name} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <h3 className="text-base font-bold">{d.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                  <p className="mt-auto pt-2 text-xs font-semibold text-brand-orange">{d.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="数据合规" title="合规不是走流程，是合作的前提" desc="详细条款见服务条款与隐私政策，这里说三个硬原则。" />
          <div className="grid gap-4 md:grid-cols-3">
            {COMPLIANCE.map((c) => (
              <Card key={c.title}>
                <CardContent className="flex gap-3 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <c.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            合作方平台入口在
            <Link href="/wechat#platforms" className="mx-1 text-primary underline underline-offset-2">
              私域入口页
            </Link>
            ，开通前需先加企微或留资。
          </div>
        </div>
      </section>

      <LeadSection defaultRole="AI公司" defaultDemand="AI合作" title="说说你的场景和数据需求" desc="写清楚你要解决什么问题、需要什么形态的数据，我们 1 个工作日内回复。" />
    </>
  );
}
