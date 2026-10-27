import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, CalendarDays } from "lucide-react";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { getAllInsights, estimateReadingTime } from "@/lib/insights";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "汽配行业洞察",
  description:
    "汽配数据、OE号匹配、VIN解析、新能源汽配、汽配出海数据合规、汽配AI数据标注的实操方法与行业观察。每周更新，全部由一线经验整理。",
  path: "/insights",
  keywords: [KEYWORDS.data, KEYWORDS.oe, KEYWORDS.vin, KEYWORDS.nev, KEYWORDS.compliance, KEYWORDS.ai],
});

export default function InsightsPage() {
  const items = getAllInsights();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "首页", url: "/" },
            { name: "汽配行业洞察", url: "/insights" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "汽配行业洞察",
            itemListElement: items.map((i, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `/insights/${i.slug}`,
              name: i.title,
            })),
          },
        ]}
      />

      <PageHero
        tag="MDX 内容库"
        title="汽配行业洞察"
        desc="不讲概念，只讲怎么干。每篇都来自一线真实问题：OE 号怎么配、VIN 怎么解、出海数据怎么合规、AI 标注怎么定规则。"
      />

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading
            tag="全部文章"
            title={`共 ${items.length} 篇 · 持续更新`}
            desc="按主题阅读。每篇都配有可落地的清单或表格，读完就能用在自己的数据上。"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {items.map((i) => (
              <Card key={i.slug} className="group transition-shadow hover:shadow-warm-md">
                <Link href={`/insights/${i.slug}`} className="block h-full">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {i.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[11px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-primary">
                      {i.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {i.description}
                    </p>
                    <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" /> {i.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> 约 {i.readingTime ?? estimateReadingTime(i.words)} 分钟
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-primary">
                        阅读 <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              文章正在整理中，先留个联系方式，更新后第一时间发你。
            </p>
          ) : null}
        </div>
      </section>

      <LeadSection />
    </>
  );
}
