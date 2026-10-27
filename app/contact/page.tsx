import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { MessageCircle, Mail, Clock, ShieldCheck, ArrowRight } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Faq } from "@/components/site/faq";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "联系与留资",
  description: "留下姓名、联系方式、身份与需求，我们按你的情况推荐最合适的一两样产品。提交后自动跳转加微信领取资料页。",
  path: "/contact",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data, KEYWORDS.sop],
});

const CONTACT_FAQS = [
  { q: "提交后会发生什么？", a: "线索进入我们的后台（可导出 CSV），同时飞书/邮件通知到人。你会被引导到「加微信领资料」页，加企微后资料直接发你。" },
  { q: "会接到推销电话吗？", a: "不会。我们只在你要的东西准备好时联系你，且你可以通过企微或邮件随时要求删除信息。" },
  { q: "急事怎么找人？", a: "直接加企微最快，备注「官网」优先通过。工作日一般 2 小时内回复，非工作日不打扰。" },
  { q: "我想合作，该选哪个需求？", a: "SaaS 工具选「SaaS」，语料/标注/评测选「AI合作」，平台数据合作选「数据产品」。选不准也没关系，描述里写清楚就行。" },
  { q: "在站内买过东西，订单怎么查？", a: "到「订单查询」页，用 QP 开头的订单号查，或者直接用下单时填的手机号 / 邮箱查最近 30 天的订单——状态、交付链接、发票申请都在那里。这也是为什么建议留手机号或邮箱。" },
];

export default function ContactPage() {
  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "联系与留资", url: "/contact" },
        ])}
      />

      <PageHero
        tag="CONTACT"
        title="说清楚你的问题，我们给对应的东西"
        desc="不推销、不群发。你填一次表，我们按身份和需求推荐最合适的一两样，不会把九类产品全推给你。"
      />

      <section className="section-pad">
        <div className="container-site grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <ContactForm />

          <div className="space-y-4">
            <Card className="bg-brand-green text-white">
              <CardContent className="space-y-3 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <MessageCircle className="h-5 w-5" /> 最快的路：加企微
                </h3>
                <p className="text-sm text-white/85">
                  备注「官网」秒通过。资料直接发你，还能进对应身份的社群，每周有复盘。
                </p>
                <Link
                  href="/wechat"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
                >
                  去加企微 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-6 text-sm">
                <h3 className="text-base font-bold">其他方式</h3>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                  <span>partner@qipeizhishiju.com（示例邮箱，请替换）</span>
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                  <span>工作日 9:30–18:30，一般 2 小时内回复</span>
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                  <span>
                    信息处理见
                    <Link href="/privacy" className="mx-1 text-primary underline underline-offset-2">
                      隐私政策
                    </Link>
                    ，可随时要求删除
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-brand-cream">
              <CardContent className="p-6 text-sm leading-relaxed">
                <h3 className="mb-2 text-base font-bold">先说清楚我们不做的事</h3>
                <p className="text-muted-foreground">
                  不卖货、不代运营、不碰交易、不收佣金。
                  我们只做知识、数据、方法与工具。如果你的需求不在这些里面，我们会直接告诉你。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="关于留资" title="你可能担心的几件事" />
          <div className="mx-auto max-w-3xl">
            <Faq items={CONTACT_FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
