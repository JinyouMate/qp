import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight, Search, Route, Repeat, Presentation } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "咨询与内训",
  description: "诊断 + 方案 + 陪跑的咨询方案（¥30,000 起 / 项目），以及面向团队的定制内训（¥20,000 起 / 场）。先做 30 分钟免费诊断。",
  path: "/consulting",
  keywords: [KEYWORDS.data, KEYWORDS.knowledge, KEYWORDS.sop, KEYWORDS.compliance],
});

const STEPS = [
  { icon: Search, name: "诊断", desc: "先把问题定义清楚。看你的真实数据、流程和人员，找出真正卡住的地方，而不是你以为的地方。", time: "1-2 周" },
  { icon: Route, name: "方案", desc: "给分阶段路线图：先做什么、后做什么、每一步要什么资源、怎么验收。只写能落地的动作。", time: "2-3 周" },
  { icon: Repeat, name: "陪跑", desc: "月度复盘，看数据不看汇报。跑偏了当场纠，跑不动了换打法。", time: "3-6 个月" },
];

const TOPICS = [
  "采购与供应链梳理：集中采购目录、供应商分级、库存周转",
  "选品与定价体系：五维评分、毛利核算、价格带定位",
  "多平台运营：店铺矩阵、类目选择、合规与风险",
  "团队能力建设：岗位 SOP、新人培养路径、考核标准",
];

export default async function ConsultingPage() {
  const products = await getProducts();
  const items = products.filter((p) => p.category === "consulting");

  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "咨询与内训", url: "/consulting" },
        ])}
      />

      <PageHero
        tag="CONSULTING"
        title="咨询与内训：只给能落地的动作，不给漂亮 PPT"
        desc="先做一次免费 30 分钟诊断。如果我们帮不上忙，会直接告诉你，不接单。"
      >
        <Button asChild variant="destructive">
          <Link href="/contact?intent=consult&demand=%E5%92%A8%E8%AF%A2">
            预约 30 分钟免费诊断 <ArrowRight />
          </Link>
        </Button>
      </PageHero>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="咨询怎么做的" title="诊断 → 方案 → 陪跑，三步都不跳" />
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.name} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <s.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-xs text-muted-foreground">{s.time}</span>
                  </div>
                  <h3 className="text-base font-bold">{s.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="服务内容" title="我们擅长这四类问题" />
          <div className="mx-auto grid max-w-3xl gap-3">
            {TOPICS.map((t) => (
              <div key={t} className="flex gap-3 rounded-xl border bg-card p-4 text-sm leading-relaxed">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="产品与收费" title="两种交付形态，收费方式不同" />
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((p) => (
              <Card key={p.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Presentation className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-base font-bold">{p.name}</h3>
                  </div>
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
                    <span className="text-lg font-bold text-brand-red">{p.price}</span>
                    <Button asChild size="sm" variant="destructive">
                      <Link href={`/contact?intent=consult&demand=${encodeURIComponent(p.slug === "corporate-training" ? "咨询" : "咨询")}`}>
                        预约沟通 <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-3xl rounded-xl border bg-card p-6 text-center">
            <Badge variant="accent" className="mb-2">先聊不收费</Badge>
            <h3 className="text-lg font-bold">30 分钟免费诊断</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              说清楚你的业务规模、现在卡在哪、想要什么结果。
              我们判断能不能帮上，能帮就给下一步建议，不能帮就直说。
            </p>
            <Button asChild className="mt-4">
              <Link href="/contact?intent=consult&demand=%E5%92%A8%E8%AF%A2">
                现在预约 <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LeadSection defaultDemand="咨询" title="把你的情况写清楚，我们来约时间" />
    </>
  );
}
