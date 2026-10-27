import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";

export const metadata: Metadata = buildMetadata({
  title: "服务条款",
  description: "服务范围、官网与第三方平台的责任边界、版权与内容授权、数据合规、免责与争议解决。",
  path: "/terms",
  keywords: [KEYWORDS.compliance],
});

const SECTIONS = [
  {
    title: "一、服务范围与边界",
    body: [
      "本站（汽配知识局官网）提供：行业知识、方法与数据的展示、检索引导、资料索取、咨询预约与合作接洽。",
      "本站不提供：商品销售、店铺代运营、支付结算、交易撮合。我们不从你的交易中收取任何佣金。",
      "具体课程的观看、知识库的查阅、数据看板的使用，分别在第三方平台完成，受该平台服务条款约束。",
    ],
  },
  {
    title: "二、内容的性质与免责",
    body: [
      "我们提供的是行业知识、方法与经验，属于参考信息，不构成投资建议、经营承诺或法律意见。",
      "数据类内容均标注来源、样本量与统计区间。市场情况随时变化，你应结合自身情况独立判断后决策。",
      "案例数据来自真实项目并经客户授权与脱敏处理，不代表你将获得同样结果。",
      "对因使用本站内容而产生的直接或间接损失，我们不承担责任；但我们承诺不故意提供错误或误导性内容。",
    ],
  },
  {
    title: "三、版权与内容授权",
    body: [
      "本站原创内容（文章、视频、报告、SOP、模板、图表、方法论）的著作权归我们所有，未经书面许可不得整体复制、转载、摘编后署名发布或用于商业用途。",
      "个人学习与非商业分享：可以引用，需注明出处与作者，且引用比例不得超过原文的三分之一，不得改动原意。",
      "你留资获取的 SOP、模板与资料，授权范围为「你本人及你所在企业/团队内部使用」，不得对外销售、分发或打包进其他产品。",
      "发现侵权可通过官网联系方式告知，我们会在核实后要求删除并保留追责权利。",
    ],
  },
  {
    title: "四、数据合规",
    body: [
      "我们遵守《个人信息保护法》《数据安全法》及相关法规，具体收集与使用规则见隐私政策。",
      "对外提供数据产品前，均做脱敏处理：不出原始单号、成交价格、客户名称及其他可识别信息。",
      "AI 数据合作（语料授权、标注规则、评测集）须签署正式协议与数据处理附录（DPA），明确用途、期限、转委托限制与到期删除机制。",
      "授权仅限约定用途。变更用途、转授权或用于再次训练，需重新取得书面确认。",
    ],
  },
  {
    title: "五、账号与社群",
    body: [
      "社群为行业交流空间，请遵守各群公告的规则。发布广告、骚扰他人、散布未经证实的信息，我们有权直接移出且不退还任何已支付费用。",
      "群内其他成员的观点不代表本站立场，你应自行判断其可靠性。",
    ],
  },
  {
    title: "六、收费与退款",
    body: [
      "本站不处理支付。课程、报告、数据订阅的收费、发票与退款，按对应第三方平台的规则执行。",
      "订阅数据产品支持 7 天试用，试用期内可随时终止，不自动续费、不产生费用。",
      "咨询服务在正式启动前可无条件取消；已启动的项目按合同约定的阶段结算。",
    ],
  },
  {
    title: "七、条款更新与争议解决",
    body: [
      "本条款如有更新，将在本页面标注更新日期。继续使用本站视为接受更新后的条款。",
      "因本条款引起的争议，双方应友好协商；协商不成的，提交本站运营主体所在地有管辖权的人民法院处理。",
      "本条款适用中华人民共和国法律（不含港澳台地区法律）。",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        tag="TERMS"
        title="服务条款"
        desc="先把责任边界、版权与数据合规说清楚，再谈合作。最近更新：2026-10-16。"
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
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="配套文件" title="一起看更完整" />
          <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
            <Link href="/privacy" className="rounded-xl border bg-card p-5 text-sm font-semibold hover:shadow-warm">
              隐私政策 →
              <p className="mt-1 text-xs font-normal text-muted-foreground">
                收集什么、存多久、怎么删除
              </p>
            </Link>
            <Link href="/partners" className="rounded-xl border bg-card p-5 text-sm font-semibold hover:shadow-warm">
              SaaS与AI合作 →
              <p className="mt-1 text-xs font-normal text-muted-foreground">
                DPA、脱敏要求、用途限定
              </p>
            </Link>
          </div>
        </div>
      </section>

      <LeadSection
        title="边界清楚了，合作才顺"
        desc="留下身份和需求，我们把对应的资料和下一步建议发你。不推销、不群发。"
      />
    </>
  );
}
