import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, Users, ExternalLink, ArrowRight, Quote } from "lucide-react";

import { WECOM } from "@/lib/brand";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink as GuardedLink } from "@/components/site/product-cta";
import { WechatBanner } from "@/components/site/wechat-banner";

export const metadata: Metadata = buildMetadata({
  title: "私域入口",
  description: "联系主理人领资料，进对应身份的交流群；内部资料库链接由系统自动下发，官网不处理支付、不跳转任何第三方平台。",
  path: "/wechat",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data],
});

const GROUPS = [
  { name: "修理厂 / 经销商群", focus: "采购梳理、供应商分级、库存周转", freq: "每月 1 次案例复盘" },
  { name: "汽配卖家交流群", focus: "选品测款、平台规则、避坑互助", freq: "每周 1 次主题讨论" },
  { name: "跨境汽配群", focus: "汇率折算、毛利核算、多平台合规", freq: "每两周 1 次数据分享" },
  { name: "数据 / AI 合作群", focus: "数据口径、标注规则、评测标准", freq: "按项目不定期" },
];

/** 联系主理人后统一开通的权益（不再列任何第三方平台入口） */
const BENEFITS = [
  { name: "内部资料库", use: "SOP、报告、模板库在线查阅", how: "扫码后系统自动下发链接", demand: "知识库" },
  { name: "行业交流群", use: "按身份分组的同行交流与复盘", how: "添加后自动邀请入群", demand: "社群" },
  { name: "体系课程 / 工具包", use: "录播、作业批改、选品核价等工具表", how: "企微内确认需求后交付", demand: "课程" },
  { name: "订阅数据看板", use: "品类价格监测与竞品动态（支持 7 天试用）", how: "留资后开通试用，到期不自动续费", demand: "数据产品" },
  { name: "AI 数据合作", use: "语料授权、标注规则与评测标准共建", how: "签协议后由项目负责人对接", demand: "AI合作" },
];

const RULES = [
  "不刷屏、不发广告、不拉人；发广告直接移出，不解释。",
  "可以吵，但不许骂人；有分歧就摆数据。",
  "真实信息优先：说清楚自己的身份和规模，别人才能给你有用的建议。",
  "群里给的是方向和方法，具体到单的决策请自己做判断，我们不背锅。",
];

export default function WechatPage() {
  return (
    <>
      <PageHero
        tag="私域入口"
        title="联系主理人，备注「官网」优先通过"
        desc="内部资料库、行业交流群、课程与工具包，都从这一步开始。官网不处理支付、不跳转第三方平台。"
      />

      {/* 提交表单后 / 拦截弹窗过来的落地提示 */}
      <Suspense fallback={null}>
        <WechatBanner />
      </Suspense>

      <section className="section-pad">
        <div className="container-site grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          {/* 企微活码（真实图片：public/wecom-qr.png） */}
          <Card id="qrcode" className="mx-auto w-fit scroll-mt-24">
            <CardContent className="p-5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={WECOM.qr}
                alt="企业微信活码：扫码添加，备注「官网」优先通过"
                width={224}
                height={224}
                className="rounded-lg"
                style={{ width: 224, height: 224 }}
              />
              <p className="mt-3 text-sm font-semibold">企微活码</p>
              <p className="text-xs text-muted-foreground">微信扫码 · 备注「官网」优先通过</p>
            </CardContent>
          </Card>

          <div>
            <div className="rounded-xl bg-brand-orange-soft p-5">
              <p className="text-base font-bold text-accent-foreground">
                联系主理人后回复
                <span className="mx-1 rounded bg-white px-2 py-0.5">【汽配数据】</span>
                获取资料。
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                一句话就行，不用自我介绍、不用说明来意。我们收到关键词后，
                把 SOP 清单、报告摘要、模板库一次性发你，并问你一句——
              </p>
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-white/70 p-3 text-sm font-semibold">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                你平时遇到这类问题一般怎么处理？
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                这是我们私域的开头第一句，不推课、不报价。先听懂你的现状，再决定给你什么。
              </p>
            </div>

            <h2 className="mt-6 text-xl font-bold md:text-2xl">加上之后你会拿到</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                "《选品SOP》《平台入驻SOP》《报价核价SOP》等 PDF 清单",
                "行业报告精华摘要（核心数据 + 趋势判断 + 一页决策建议）",
                "一线在用的表格模板（飞书可直接复制）",
                "按你的身份拉进对应社群，每周/每月有复盘",
                "内部资料库、课程、工具包、数据看板的开通权限（企微内交付）",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/products">看产品阶梯</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/contact?intent=consult">预约咨询 <ArrowRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="社群矩阵" title="四个群，按身份进" desc="不用全进，选你对应的那个。" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map((g) => (
              <Card key={g.name} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Users className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-base font-bold">{g.name}</h3>
                  <p className="text-sm text-muted-foreground">{g.focus}</p>
                  <Badge variant="accent" className="mt-auto w-fit">{g.freq}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className="section-pad">
        <div className="container-site">
          <SectionHeading
            tag="权益一览"
            title="资料与交付都在企微，统一在这里开通"
            desc="官网不处理支付、不跳转任何第三方平台。点任何一项都只弹企微二维码，扫码后自动下发。"
          />
          <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">平台</th>
                  <th className="px-4 py-3 font-semibold">用来做什么</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">怎么开通</th>
                  <th className="px-4 py-3 font-semibold text-right">入口</th>
                </tr>
              </thead>
              <tbody>
                {BENEFITS.map((p) => (
                  <tr key={p.name} className="border-t">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.use}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.how}</td>
                    <td className="px-4 py-3 text-right">
                      <GuardedLink label="扫码获取" platform={p.name} demand={p.demand} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            AI 数据合作需先签署合作协议与 DPA，详见
            <Link href="/terms" className="mx-1 text-primary underline underline-offset-2">服务条款</Link>
          </p>
        </div>
      </section>

      <section className="section-pad bg-brand-green-soft">
        <div className="container-site">
          <SectionHeading tag="社群规则" title="先把话说在前面" />
          <div className="mx-auto grid max-w-3xl gap-3">
            {RULES.map((r) => (
              <div key={r} className="flex gap-3 rounded-xl border bg-card p-4 text-sm leading-relaxed">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                {r}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadSection
        title="还没留资？资料也能先发你"
        desc="联系主理人最快；想先看看也行，填一次表，我们把资料发到你留的联系方式上。"
      />
    </>
  );
}
