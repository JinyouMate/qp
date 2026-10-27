import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Smartphone, Copy, Search } from "lucide-react";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { PLANET } from "@/lib/brand";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Faq } from "@/components/site/faq";
import { LeadSection } from "@/components/site/lead-section";
import { PlanetNote } from "@/components/site/planet-note";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ============================================================
   查询我的资料权限（原「查单页」的替代）

   本站不接入任何支付，因此没有站内订单、没有交易流水号。
   用户买了什么、能看到什么，全部以**知识星球**里的记录为准。
   查不到 → 加客服（企微）人工核对。
   ============================================================ */

export const metadata: Metadata = buildMetadata({
  title: "查询我的资料权限",
  description:
    "本站不收款、没有站内订单。你在知识星球加入的星球、购买的课程与资料，都在星球 APP 内查阅；找不到或付款后未开通，加企微客服人工核对。",
  path: "/access",
  keywords: [KEYWORDS.knowledge, KEYWORDS.sop],
  noindex: true,
});

const WAYS = [
  {
    icon: Smartphone,
    title: "在知识星球 APP 里看",
    steps: [
      "打开知识星球 APP → 底部「我」",
      "进入「我加入的」→ 找到「汽配知识局」",
      "里面的 SOP、报告、模板、课程回放，付款后永久可查",
    ],
  },
  {
    icon: Copy,
    title: "用微信打开星球链接",
    steps: [
      "回到官网产品页，点【加入知识星球】重新获取一次链接",
      "复制链接 → 粘贴到微信（自己或文件传输助手）→ 点击打开",
      "按提示加入后，内容与 APP 端同步解锁",
    ],
  },
  {
    icon: Search,
    title: "还是找不到？找客服核对",
    steps: [
      "加企业微信，报你留资时填的手机号 / 微信号",
      "我们按星球后台记录核对开通状态（一般当天回复）",
      "确认付款未开通的，人工补开；重复付款的，原路退回",
    ],
  },
];

const FAQS = [
  {
    q: "官网为什么查不到我的订单？",
    a: "本站不处理支付，也没有站内收银台。成交、付款与交付全部在知识星球完成，所以订单与权益以星球后台记录为准。",
  },
  {
    q: "付款后多久能看内容？",
    a: "星球加入成功后立即解锁。若超过 10 分钟仍看不到，多半是微信号与付款账号不一致，加企微报手机号即可核对补开。",
  },
  {
    q: "我能看多久？到期会失效吗？",
    a: "加入即永久有效，SOP 与报告持续更新，不额外收费。年度星球到期只影响后续新增内容，历史内容仍可查阅。",
  },
  {
    q: "可以开发票吗？",
    a: "由知识星球或对应第三方平台按其规则开具，本站不代收货款、不开发票。需要发票可在星球内联系星主。",
  },
  {
    q: "能退款吗？",
    a: "按知识星球平台的退款规则执行。遇到重复付款、付错产品这类情况，加企微我们协助你走平台退款流程。",
  },
];

export default function AccessPage() {
  return (
    <>
      <PageHero
        tag="权限查询"
        title="查询我的资料权限"
        desc="本站不收款、没有站内订单。你加入的星球、购买的课程与资料，全部在知识星球里查阅；查不到就加客服，我们人工核对。"
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="mb-6 flex items-start gap-2 rounded-xl bg-brand-green-soft p-4 text-sm leading-relaxed">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={1.5} />
            <span>
              这里不展示任何联系方式与交易流水——本站也没有这些信息。
              你的权益状态以{PLANET.name}后台记录为准。
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {WAYS.map((w) => (
              <Card key={w.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <w.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="text-base font-bold">{w.title}</h2>
                  <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {w.steps.map((s, i) => (
                      <li key={s} className="flex gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-[11px] font-semibold text-brand-orange">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                  {w.title.startsWith("还是找不到") && (
                    <Button asChild variant="orange" className="mt-auto w-full">
                      <Link href={`${PLANET.wecomPath}?from=access`}>
                        <MessageCircle /> 加企微客服核对
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site max-w-3xl">
          <SectionHeading
            tag="常见问题"
            title="关于权限，大家最常问的五件事"
            desc="答不了的，直接加企微问人。"
          />
          <Faq items={FAQS} />
          <div className="mt-6">
            <PlanetNote />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <Link href="/products">
                回到产品中心 <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${PLANET.wecomPath}?from=access`}>
                <MessageCircle /> 加企微，人工查权限
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LeadSection
        title="还没加入？先留资拿入口"
        desc="留一次联系方式，星球专属入口和新人资料包一起发你。"
      />
    </>
  );
}
