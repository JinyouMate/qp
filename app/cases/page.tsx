import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCases } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "案例",
  description: "真实脱敏案例：修理厂与经销商的采购梳理、从业者的选品与毛利修正、平台企业与 AI 公司的数据合作。每个案例附结果数据与口径说明。",
  path: "/cases",
  keywords: [KEYWORDS.data, KEYWORDS.oe, KEYWORDS.sop, KEYWORDS.compliance],
});

export default async function CasesPage() {
  const cases = await getCases();
  const groups = Array.from(new Set(cases.map((c) => c.group)));

  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "案例", url: "/cases" },
        ])}
      />

      <PageHero
        tag="CASES"
        title="案例：只看结果数据，不看形容词"
        desc="以下案例均经客户授权并做脱敏处理，不出现客户名称与可识别信息。每个案例都标注统计口径与时间范围。"
      >
        <Badge variant="outline" className="bg-white">
          共 {cases.length} 个公开案例
        </Badge>
      </PageHero>

      {groups.map((g) => (
        <section key={g} className="section-pad border-b last:border-0">
          <div className="container-site">
            <div className="mb-8">
              <h2 className="text-xl font-bold md:text-2xl">{g}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {cases.filter((c) => c.group === g).length} 个案例
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {cases
                .filter((c) => c.group === g)
                .map((c) => (
                  <Card key={c.id} className="h-full">
                    <CardContent className="flex h-full flex-col gap-3 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                        <Quote className="h-4 w-4" />
                        {c.client}
                      </div>
                      <div className="space-y-2 text-sm leading-relaxed">
                        <p>
                          <span className="font-semibold text-muted-foreground">问题：</span>
                          {c.problem}
                        </p>
                        <p>
                          <span className="font-semibold text-muted-foreground">方案：</span>
                          {c.solution}
                        </p>
                      </div>
                      <div className="mt-auto grid gap-3 border-t border-dashed pt-4 sm:grid-cols-2">
                        {c.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="text-2xl font-bold text-brand-red">{m.value}</div>
                            <div className="text-xs text-muted-foreground">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="关于案例的说明" title="我们对案例的三条自我要求" />
          <div className="mx-auto grid max-w-3xl gap-3 text-sm leading-relaxed">
            {[
              "不做无口径表述：不写「提升 300%」，写清楚基线、周期与统计方式。",
              "不做无法核实的归因：属于客户自身努力的部分，就说是客户的功劳。",
              "失败也记：踩过的坑进了避坑库，方法不对的地方会写明我们后来怎么改的。",
            ].map((t) => (
              <div key={t} className="flex gap-3 rounded-xl border bg-card p-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                {t}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/contact?intent=consult">
                我的问题能不能也这样解决？ <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LeadSection title="想要更完整的方案细节？" desc="留资后我们把对应案例的方法拆解与可复用清单发给你。" />
    </>
  );
}
