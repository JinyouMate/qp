import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, ExternalLink, PlayCircle, Users, ClipboardCheck } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCta } from "@/components/site/product-cta";
import { JsonLd, courseSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "培训课程",
  description: "录播 + 社群答疑 + 作业批改的体系课。从选品、适配数据到跨境平台运营，讲方法也讲真实数据。课程在小鹅通 / 知识星球交付。",
  path: "/courses",
  keywords: [KEYWORDS.knowledge, KEYWORDS.sop, KEYWORDS.data, KEYWORDS.compliance],
});

const COURSES = [
  {
    name: "《汽配选品体系课》",
    level: "入门 → 进阶",
    lessons: "24 讲 · 约 9 小时",
    for: "0-2 年经验，凭感觉选品、爆款靠运气的卖家",
    solve: "把「感觉」换成五维评分，把「运气」换成测款流程。",
    get: "录播 + 选品评分表 + 4 周答疑",
    price: "¥999",
  },
  {
    name: "《适配数据与避坑实战》",
    level: "进阶",
    lessons: "18 讲 · 约 7 小时",
    for: "吃过适配数据亏、被退货和差评拖住的团队",
    solve: "讲清适配数据从哪来、怎么校验、错了怎么兜底。",
    get: "录播 + 适配校验清单 + 专家复核 1 次",
    price: "¥1,680",
  },
  {
    name: "《跨境汽配平台运营课》",
    level: "进阶 → 高阶",
    lessons: "30 讲 · 约 12 小时",
    for: "做 Ozon / eBay / Temu / Jumia 等多平台的团队",
    solve: "汇率折算、毛利结构、多店铺库存与合规，一次讲透。",
    get: "录播 + 成本核算表 + 作业批改 + 结课清单",
    price: "¥3,980",
  },
];

const FORMAT = [
  { icon: PlayCircle, title: "录播", desc: "按小节拆开，通勤路上也能听，永久回看。" },
  { icon: Users, title: "社群答疑", desc: "同期学员群 + 主讲答疑，问题不过周。" },
  { icon: ClipboardCheck, title: "作业批改", desc: "交自己的真实业务数据，我们逐条批改，不是走过场。" },
];

export default async function CoursesPage() {
  const products = await getProducts();
  const course = products.find((p) => p.slug === "courses");

  return (
    <>
      {/* 结构化数据：Course（每门课一个）+ 面包屑 */}
      <JsonLd
        data={[
          ...COURSES.map((c) =>
            courseSchema({
              name: c.name,
              description: `${c.solve} 交付：${c.get}（${c.lessons}）`,
              audience: c.for,
              price: c.price,
              url: "/courses",
            })
          ),
          breadcrumbSchema([
            { name: "首页", url: "/" },
            { name: "培训课程", url: "/courses" },
          ]),
        ]}
      />

      <PageHero
        tag="COURSES"
        title="体系课：不是再给你一堆干货，是给你一套方法"
        desc="干货的问题是零散。课程的价值在于把散的东西排成顺序，配上答疑和批改，让你真的跑起来。"
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/contact?intent=asset&demand=%E8%AF%BE%E7%A8%8B">先要一份课程大纲</Link>
          </Button>
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="课程形式" title="录播 + 答疑 + 批改，缺一个都不算课" />
          <div className="grid gap-4 md:grid-cols-3">
            {FORMAT.map((f) => (
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
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="课程列表" title="三门课，按你的阶段选" />
          <div className="grid gap-4 lg:grid-cols-3">
            {COURSES.map((c) => (
              <Card key={c.name} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{c.level}</Badge>
                    <span className="text-xs text-muted-foreground">{c.lessons}</span>
                  </div>
                  <h3 className="text-base font-bold">{c.name}</h3>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-muted-foreground">适合谁</dt>
                      <dd>{c.for}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-muted-foreground">解决什么</dt>
                      <dd>{c.solve}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-muted-foreground">你会得到</dt>
                      <dd>{c.get}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto border-t border-dashed pt-3">
                    <div className="text-lg font-bold text-brand-red">{c.price}</div>
                    {course && (
                      <div className="mt-2">
                        <ProductCta product={course} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            课程在小鹅通 / 知识星球交付，官网不处理支付；点击购买会先引导加企微或留资。
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-3xl rounded-xl border bg-card p-6">
            <h3 className="text-lg font-bold">不确定该选哪门？</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              把自己现在的业务情况、团队规模和卡住的地方写清楚，我们给你一条路径——
              如果现有课程解决不了，会直接告诉你，不硬卖。
            </p>
            <Button asChild className="mt-4">
              <Link href="/contact?intent=consult&demand=%E8%AF%BE%E7%A8%8B">
                说说我的情况 <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LeadSection defaultDemand="课程" title="先拿课程大纲和一节试听" desc="留资后我们把三门课的完整大纲 + 一节正课试听发给你。" />
    </>
  );
}
