import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import Link from "next/link";
import { Mail } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { LeadSection } from "@/components/site/lead-section";

export const metadata: Metadata = buildMetadata({
  title: "隐私政策",
  description: "我们收集什么信息、为什么收集、保存多久、你怎么删除，以及 Cookie 与第三方平台的说明。",
  path: "/privacy",
  keywords: [KEYWORDS.compliance],
});

const SECTIONS = [
  {
    title: "一、我们收集哪些信息",
    body: [
      "你主动填写的信息：姓名、微信/手机号、身份（修理厂/汽配商/平台企业/AI公司/其他）、需求方向、具体问题描述。",
      "自动记录的信息：来源渠道参数（UTM）、来源页面、访问时间。仅用于统计哪个渠道的内容对你有用，不做个人画像。",
      "我们不收集：身份证号、银行卡信息、精确位置信息。官网不处理支付，也不会要求你提供支付信息。",
    ],
  },
  {
    title: "二、我们为什么收集",
    body: [
      "发送你索取的材料：SOP 清单、报告摘要、模板库、课程资料。",
      "与你联系：针对你描述的问题给建议、安排诊断或沟通合作。",
      "改进内容：统计哪类内容对哪类身份有用，决定下一步做什么。",
      "我们不会把你的信息出售给第三方，也不会用于与本条列明目的无关的用途。",
    ],
  },
  {
    title: "三、保存多久",
    body: [
      "线索信息自收集之日起保存 24 个月，或直至你要求删除（以较早者为准）。",
      "你索要材料的发送记录保存 6 个月，用于核对是否发送成功。",
      "匿名化的统计信息可长期保留，因其已无法识别到你个人。",
    ],
  },
  {
    title: "四、你怎么查看、修改和删除",
    body: [
      "随时通过企业微信或邮件告诉我们，我们会在 7 个工作日内处理你的查看、更正、删除请求。",
      "删除请求一经处理即从生产库中移除，备份数据在下一次备份周期内覆盖。",
      "若你同时加入了社群，退群与删除信息是两个独立动作，需要分别提出。",
    ],
  },
  {
    title: "五、Cookie 与来源追踪",
    body: [
      "我们使用少量本地存储记录来源渠道参数（UTM）与来源页面，用于判断内容效果，不含个人身份信息。",
      "第三方平台（小鹅通、知识星球、Baklib、飞书及合作方平台）会在其自身域名下设置 Cookie，受其各自隐私政策约束。我们会在跳转前提示。",
      "你可以在浏览器设置中清除本地存储，清除后仅影响渠道统计，不影响正常使用。",
    ],
  },
  {
    title: "六、第三方平台说明",
    body: [
      "课程交付：小鹅通 / 知识星球。知识库与文档：Baklib / 飞书。数据看板：飞书多维表格。合作交付：合作方平台。",
      "你在这些平台上的行为与信息，受该平台的隐私政策管理。官网不持有你在第三方平台的账号数据。",
      "所有第三方链接都会附加来源参数，仅用于统计来源，不含你的个人身份信息。",
    ],
  },
  {
    title: "七、AI 数据合作中的特别约定",
    body: [
      "涉及企业客户的业务数据，一律先脱敏再用于标注或训练，不出原始单号、成交价格与客户名称。",
      "语料授权签署正式协议与数据处理附录（DPA），明确用途、期限、转委托限制与到期删除机制。",
      "你可以随时撤回授权，我们会通知合作方停止使用并删除对应数据，具体流程在 DPA 中约定。",
    ],
  },
  {
    title: "八、信息安全与未成年人",
    body: [
      "我们对线索数据库启用访问控制，仅业务需要的人员可查看，操作留痕。",
      "我们的服务对象为行业从业者，不面向未成年人收集个人信息。如发现误收集，将立即删除。",
    ],
  },
  {
    title: "九、政策更新与联系方式",
    body: [
      "本政策如有更新，会在本页面标注更新日期，重大变更会通过官网公告。",
      "隐私相关问题请联系：partner@qipeizhishiju.com（示例邮箱，请替换为真实邮箱）。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        tag="PRIVACY"
        title="隐私政策"
        desc="我们尽量把话说清楚：收集什么、为什么收集、存多久、你怎么删。最近更新：2026-10-16。"
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-3xl space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-brand-green">{s.title}</h2>
                <ul className="mt-3 space-y-2">
                  {s.body.map((b) => (
                    <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-xl border bg-brand-cream p-5 text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <Mail className="h-4 w-4 text-brand-green" /> 有疑问直接问
              </p>
              <p className="mt-2 text-muted-foreground">
                隐私相关的任何问题，发邮件或加企微说明即可，我们会在 7 个工作日内回复。
                也可以一并查看
                <Link href="/terms" className="mx-1 text-primary underline underline-offset-2">
                  服务条款
                </Link>
                中关于版权与数据合规的部分。
              </p>
            </div>
          </div>
        </div>
      </section>

      <LeadSection
        title="看清规则了？那就从免费资料开始"
        desc="留一次资料，SOP 清单、报告摘要、模板库都能拿走。信息怎么用，上面都写清楚了。"
      />
    </>
  );
}
