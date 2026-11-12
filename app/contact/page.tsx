import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";

import { PageHero } from "@/components/site/page-hero";
import { WecomCtaCard } from "@/components/site/wecom-cta-card";
import { Faq } from "@/components/site/faq";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "联系我们",
  description: "官网不收集任何表单信息。扫描二维码添加主理人企微，立即获取完整数据资料或诊断服务。",
  path: "/contact",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data, KEYWORDS.sop],
});

const CONTACT_FAQS = [
  {
    q: "加上之后会发生什么？",
    a: "主理人一对一了解你的品类和现状，把对应的数据资料或诊断建议直接发你，不群发、不推销。",
  },
  {
    q: "官网会不会收集我的信息？",
    a: "不会。本站不设任何表单、不收集姓名与联系方式；只有你主动添加企业微信后，我们才会与你对话。",
  },
  {
    q: "资料多久能拿到？",
    a: "添加时备注「官网」优先通过，工作日一般 2 小时内回复，资料随对话直接发送，无需跳转其他平台。",
  },
  {
    q: "急事怎么找人？",
    a: "直接在企业微信里留言即可，工作日 9:30–18:30 一般 2 小时内回复，非工作日不打扰。",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "联系我们", url: "/contact" },
        ])}
      />

      <PageHero
        tag="CONTACT"
        title="想聊你的品类？直接找主理人"
        desc="不推销、不群发、不用填表。所有资料与诊断都由主理人在企业微信里一对一交付。"
      />

      {/* 全站唯一转化动作：加微大卡片 */}
      <WecomCtaCard from="contact" subject="联系我们" />

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="关于这次沟通" title="你可能担心的几件事" />
          <div className="mx-auto max-w-3xl">
            <Faq items={CONTACT_FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
