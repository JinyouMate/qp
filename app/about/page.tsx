import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight, Ban, Compass } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "关于我们",
  description: "汽配知识局是汽配行业知识资产运营商：把隐性知识变成可交易资产。不卖货、不代运营、不碰交易。",
  path: "/about",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data, KEYWORDS.ai],
});

const NOT_DOING = [
  "不卖货：我们不参与任何商品的买卖，也不从中抽佣。",
  "不代运营：不接店铺代运营，避免既当裁判又当运动员。",
  "不碰交易：官网不处理支付，成交与交付都在第三方平台。",
  "不吹数据：不写无口径的「提升 300%」，每个数字都标来源与周期。",
];

const PRINCIPLES = [
  {
    title: "先给再看",
    desc: "免费层给的是能直接照做的清单，不是诱饵。你先用，用得上再谈下一步。",
  },
  {
    title: "口径比结论重要",
    desc: "一个含糊的数字比没有数字更危险。所有数据标明来源、样本量与统计区间，存疑就标存疑。",
  },
  {
    title: "帮不上就直说",
    desc: "不是所有问题都能靠知识解决。判断我们帮不上时，会直接告诉你，不接单、不硬卖。",
  },
];

const MILESTONES = [
  { time: "起点", text: "从自营汽配业务起步，做跨境与国内多平台，攒下第一手数据与踩坑记录。" },
  { time: "沉淀", text: "把内部用的名词表、适配库、SOP 整理成册，先给自己的团队用。" },
  { time: "外溢", text: "同行来要，才开始对外。内容先上公域，用内容换信任，不用广告换流量。" },
  { time: "资产化", text: "把知识分成四层：免费清单建立信任，体系课与报告形成转化，咨询与数据合作做长期交付。" },
  { time: "现在", text: "知识库 12,000+ 条目，服务 1,800+ 从业者，开始与 AI 公司做语料与评测合作。" },
];

export default function AboutPage() {
  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "关于我们", url: "/about" },
        ])}
      />

      <PageHero
        tag="ABOUT"
        title="我们是汽配行业知识资产运营商"
        desc="把散落在老师傅脑子里、Excel 表里、聊天记录里的隐性知识，整理成查得到、学得会、可交易的知识资产。"
      >
        <p className="text-base font-semibold text-brand-green">
          从数据到决策，从知识到工具。
        </p>
      </PageHero>

      {/* 定位与边界 */}
      <section className="section-pad">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <Card className="border-brand-green/30 bg-brand-green-soft">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-brand-green">
                <Compass className="h-5 w-5" /> 我们做什么
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                做四件事：把一线经验整理成<strong>知识库与 SOP</strong>；把真实交易数据处理成
                <strong>报告与数据产品</strong>；把方法排成顺序做成
                <strong>课程</strong>；对具体问题给
                <strong>咨询与内训</strong>，对行业伙伴开放
                <strong>SaaS 与 AI 数据合作</strong>。
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                官网只做展示、信任、路由和留资。成交和交付全部放在第三方平台，
                我们不碰钱，也不在你的交易里抽成。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-brand-red">
                <Ban className="h-5 w-5" /> 我们不做什么
              </h2>
              <ul className="mt-3 space-y-2.5">
                {NOT_DOING.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 三条铁律 */}
      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="三条铁律" title="我们给自己定的规矩" desc="不写在墙上，写在每个决策里。" />
          <div className="grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Card key={p.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-bold">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 里程碑 */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="怎么走到这里" title="不是规划出来的，是被需求推着走的" />
          <div className="mx-auto max-w-3xl">
            {MILESTONES.map((m, i) => (
              <div key={m.time} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {i < MILESTONES.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-brand-green">{m.time}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流量路径 */}
      <section className="section-pad bg-brand-green text-white">
        <div className="container-site">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-2 block text-xs font-semibold tracking-[0.25em] text-brand-orange">
              FLOW
            </span>
            <h2 className="text-2xl font-bold md:text-3xl">流量必须经过官网或私域</h2>
            <p className="mt-3 text-sm text-white/80">
              内容平台只负责让人认识我们，不直接跳到第三方成交页。
              这条路径是我们所有运营动作的前提。
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-sm md:flex-row md:justify-center md:gap-2">
            {[
              "公域内容",
              "官网 / 私域",
              "第三方成交交付",
              "私域复购转介绍",
              "官网品牌资产",
            ].map((s, i, arr) => (
              <div key={s} className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 px-4 py-2 font-medium">{s}</span>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-brand-orange md:rotate-0 rotate-90" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadSection
        title="想更了解我们？先从免费资料开始"
        desc="判断我们靠不靠谱，看内容、看清单，比看我们说自己靠谱有用。"
      />

      <section className="pb-12 text-center">
        <Button asChild variant="outline">
          <Link href="/cases">
            先看案例证据 <ArrowRight />
          </Link>
        </Button>
      </section>
    </>
  );
}
