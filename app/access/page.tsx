import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Smartphone, Users, Search } from "lucide-react";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { WECOM } from "@/lib/brand";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Faq } from "@/components/site/faq";
import { WecomCtaCard } from "@/components/site/wecom-cta-card";
import { WecomCtaButton } from "@/components/site/wecom-dialog";
import { WecomNote } from "@/components/site/wecom-note";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ============================================================
   查询我的资料权限

   本站不接入任何支付、不跳转任何第三方平台，因此没有站内订单、没有交易流水。
   资料与交付全部在企业微信完成：扫码添加后自动下发内部资料库链接并邀请进群。
   查不到 → 联系主理人人工核对。
   ============================================================ */

export const metadata: Metadata = buildMetadata({
  title: "查询我的资料权限",
  description:
    "本站不收款、没有站内订单。资料与交付全部在企业微信完成：扫码添加后自动下发内部资料库链接并邀请进群；找不到就联系主理人人工核对。",
  path: "/access",
  keywords: [KEYWORDS.knowledge, KEYWORDS.sop],
  noindex: true,
});

const WAYS = [
  {
    icon: Smartphone,
    title: "在企业微信里看",
    steps: [
      "打开微信 → 通讯录「企业微信联系人」→ 找到汽配知识局",
      "查看聊天记录里我们发你的内部资料库链接",
      "链接点开即是 SOP、报告、模板与课程回放，长期有效",
    ],
  },
  {
    icon: Users,
    title: "在行业交流群里问",
    steps: [
      "添加后我们会邀请你进入对应身份的交流群",
      "群里直接提问，同行与我们一起答",
      "每周 / 每月有复盘与资料更新提醒",
    ],
  },
  {
    icon: Search,
    title: "还是找不到？找客服核对",
    steps: [
      "添加企业微信，说明你要核对哪份资料",
      "我们按企微聊天记录核对开通状态（一般当天回复）",
      "确认漏发的，人工补发；重复领取的，合并处理",
    ],
  },
];

const FAQS = [
  {
    q: "官网为什么查不到我的订单？",
    a: "本站不处理支付，也没有站内收银台、不跳转任何第三方平台。资料与交付全部在企业微信完成，所以权益以企微后台与资料库记录为准。",
  },
  {
    q: "联系主理人后多久能收到资料？",
    a: "扫码添加后系统自动发送，一般几分钟内。若超过当天仍未收到，多半是添加时用的微信号不同，在企微里说明一下即可核对补发。",
  },
  {
    q: "我能看多久？到期会失效吗？",
    a: "加入即长期有效，SOP 与报告持续更新，不额外收费。年度权益到期只影响后续新增内容，历史内容仍可查阅。",
  },
  {
    q: "可以开发票吗？",
    a: "可以。在企微里说明需求，由运营主体（深圳市元卦科技有限公司）直接开具电子发票。",
  },
  {
    q: "不想加了，能删掉我的信息吗？",
    a: "能。在企微里说一声，或按《隐私政策》里的联系方式申请，我们按流程删除相关记录。",
  },
];

export default function AccessPage() {
  return (
    <>
      <PageHero
        tag="权限查询"
        title="查询我的资料权限"
        desc="本站不收款、没有站内订单。内部资料库链接与行业交流群邀请，都在企业微信里；查不到就加客服，我们人工核对。"
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="mb-6 flex items-start gap-2 rounded-xl bg-brand-green-soft p-4 text-sm leading-relaxed">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={1.5} />
            <span>
              这里不展示任何联系方式与交易流水——本站也没有这些信息。
              你的权益状态以{WECOM.name}后台与资料库记录为准。
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {WAYS.map((w) => (
              <Card key={w.title} className="card-hover h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <w.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="text-base font-bold">{w.title}</h2>
                  <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {w.steps.map((s, i) => (
                      <li key={s} className="flex gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-[11px] font-semibold text-brand-orange-ink">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                  {w.title.startsWith("还是找不到") && (
                    <WecomCtaButton
                      variant="orange"
                      label="联系主理人核对"
                      from="access-check"
                      subject="资料权限核对"
                      className="mt-auto w-full"
                    />
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
            desc="答不了的，直接联系主理人问人。"
          />
          <Faq items={FAQS} />
          <div className="mt-6">
            <WecomNote />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <Link href="/products">
                回到产品中心 <ArrowRight />
              </Link>
            </Button>
            <WecomCtaButton
              variant="outline"
              label="联系主理人，人工查权限"
              from="access-manual"
              subject="资料权限核对"
            />
          </div>
        </div>
      </section>

      <WecomCtaCard from="access" subject="资料权限" />
    </>
  );
}
