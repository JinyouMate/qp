import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, MessageCircle, Users, ExternalLink, ArrowRight, Quote } from "lucide-react";

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
  description: "加企微领资料，进对应身份的社群；知识库、课程、数据看板等第三方平台入口统一在这里开通。",
  path: "/wechat",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data],
});

const GROUPS = [
  { name: "修理厂 / 经销商群", focus: "采购梳理、供应商分级、库存周转", freq: "每月 1 次案例复盘" },
  { name: "汽配卖家交流群", focus: "选品测款、平台规则、避坑互助", freq: "每周 1 次主题讨论" },
  { name: "跨境汽配群", focus: "汇率折算、毛利核算、多平台合规", freq: "每两周 1 次数据分享" },
  { name: "数据 / AI 合作群", focus: "数据口径、标注规则、评测标准", freq: "按项目不定期" },
];

const PLATFORMS = [
  { name: "小鹅通", use: "体系课程、工具包、年度通行证", how: "加企微后发课程链接与优惠码", demand: "课程" },
  { name: "知识星球", use: "深度问答沉淀与同行交流", how: "加企微后拉你进星球", demand: "知识库" },
  { name: "Baklib / 飞书", use: "基础知识库、SOP、模板库在线查阅", how: "加企微后开通阅读权限", demand: "知识库" },
  { name: "飞书多维表格", use: "订阅数据看板（支持 7 天试用）", how: "留资后开通试用，到期不自动续费", demand: "数据产品" },
  { name: "合作方平台", use: "SaaS 联合运营 / AI 数据合作交付", how: "签协议后由项目负责人开通", demand: "AI合作" },
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
        title="加企微，备注「官网」优先通过"
        desc="资料、社群、第三方平台权限，都从这一步开始。官网不处理支付，所有成交与交付都在第三方平台完成。"
      />

      {/* 提交表单后 / 拦截弹窗过来的落地提示 */}
      <Suspense fallback={null}>
        <WechatBanner />
      </Suspense>

      <section className="section-pad">
        <div className="container-site grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          {/* 企微二维码占位 */}
          <Card id="qrcode" className="mx-auto w-fit scroll-mt-24">
            <CardContent className="p-5 text-center">
              <div className="figure-ph h-56 w-56">
                <MessageCircle className="h-7 w-7 text-brand-orange" />
                <p className="px-4 text-xs">此处替换为企业微信活码图片</p>
              </div>
              <p className="mt-3 text-sm font-semibold">企微活码</p>
              <p className="text-xs text-muted-foreground">备注「官网」优先通过</p>
            </CardContent>
          </Card>

          <div>
            <div className="rounded-xl bg-brand-orange-soft p-5">
              <p className="text-base font-bold text-accent-foreground">
                加微信后回复
                <span className="mx-1 rounded bg-white px-2 py-0.5">【汽配数据】</span>
                领取资料。
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
                "知识库、课程、工具包、数据看板的开通权限（第三方平台）",
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
            tag="第三方平台入口"
            title="成交与交付都在第三方，统一在这里开通"
            desc="官网不处理支付。点任何平台都会先提示「加微信领取完整资料/优惠链接」，再放行。"
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
                {PLATFORMS.map((p) => (
                  <tr key={p.name} className="border-t">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.use}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.how}</td>
                    <td className="px-4 py-3 text-right">
                      <GuardedLink href="#" label="前往" platform={p.name} demand={p.demand} />
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
        desc="加企微最快；想先看看也行，填一次表，我们把资料发到你留的联系方式上。"
      />
    </>
  );
}
