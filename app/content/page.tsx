import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { WecomCtaCard } from "@/components/site/wecom-cta-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ============================================================
   客户成果与数据洞察（原内容归档页，2026-11-08 重构）
   定位：对外信任页。只写已经交付的结果，不写待办与设想。
   底部统一走 WecomCtaCard → 主理人企微二维码弹窗，不设表单。
   ============================================================ */

export const metadata: Metadata = buildMetadata({
  title: "客户成果与数据洞察",
  description:
    "不是理论，是已经跑通的选品与降退货逻辑。平均退货率降低 18%、覆盖 200+ 细分品类、累计诊断 500+ SKU，附已交付卖家的真实反馈与量化结果。",
  path: "/content",
  keywords: [KEYWORDS.data, KEYWORDS.oe, KEYWORDS.sop, KEYWORDS.compliance],
});

/** 顶部三项硬指标：全部为已完成交付的口径 */
const METRICS = [
  {
    value: "18%",
    label: "平均退货率降低",
    note: "已交付卖家的适配错配排查后均值",
  },
  {
    value: "200+",
    label: "覆盖细分品类",
    note: "已完成价格带与竞争格局诊断的类目",
  },
  {
    value: "500+",
    label: "累计诊断 SKU",
    note: "已完成逐 SKU 毛利与适配校验的商品",
  },
];

/** 深度案例：客户信息均已脱敏，只保留可公开的量化结果 */
const CASES = [
  {
    no: "CASE 01",
    tags: ["Ozon 卖家", "车灯类目", "初创团队"],
    pain:
      "车灯适配表靠人工比对，同一车型在不同平台标注不一致，发货后大量因「装不上」退回，客服和运费两头赔。",
    solution:
      "接入数据中控台的适配关系库，对 312 万条底层 SKU 的 OE 号、车型年款与适配关系做三层校验，在上架前把错配 SKU 直接筛掉。",
    results: [
      { value: "-18%", label: "退货率" },
      { value: "-42%", label: "适配纠纷" },
    ],
    quote:
      "以前每个月都在处理「装不上」的退货，上架前能查到适配关系之后，这类单子基本没了。",
    author: "Ozon 车灯卖家 · L 先生",
  },
  {
    no: "CASE 02",
    tags: ["跨境多平台", "制动件类目", "3 人小团队"],
    pain:
      "按人民币售价直接折算定价，汇率、平台佣金、退货损耗都没算进去，看着天天出单，实际一直在贴钱。",
    solution:
      "用数据中控台的黄金毛利区间表逐 SKU 重算全成本，对照 161.8 万+ 去重商品的价格带，砍掉 40% 毛利线以下的高退货款。",
    results: [
      { value: "+12%", label: "毛利率" },
      { value: "-37%", label: "在售 SKU 数" },
    ],
    quote:
      "第一次看到每个 SKU 的真实毛利，才发现有三分之一的款是白干。砍掉之后利润反而涨了。",
    author: "跨境卖家 · W 女士",
  },
  {
    no: "CASE 03",
    tags: ["拼多多店铺", "易损件类目", "成长期团队"],
    pain:
      "选品靠跟爆款，上新一批压一批，滞销库存占着现金，也说不清下一个该往哪个细分品类加。",
    solution:
      "调取数据中控台的细分品类价格带与竞争格局，对 200+ 细分品类做机会打分，按可回溯的口径重排上新优先级。",
    results: [
      { value: "×2.3", label: "测款通过率" },
      { value: "-29%", label: "滞销库存占比" },
    ],
    quote:
      "不用再赌爆款了，先看数据再决定进不进，库存周转明显轻了。",
    author: "店铺负责人 · C 先生",
  },
];

export default function ContentPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "客户成果与数据洞察", url: "/content" },
        ])}
      />

      <PageHero
        tag="CLIENT RESULTS"
        title="客户成果与数据洞察"
        desc="不是理论，是已经跑通的选品与降退货逻辑。以下是部分卖家的真实反馈。"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-brand-orange/15 bg-card p-5 shadow-warm"
            >
              <div className="text-3xl font-bold leading-none text-brand-green md:text-4xl">
                {m.value}
              </div>
              <div className="mt-2.5 text-sm font-semibold">{m.label}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
            </div>
          ))}
        </div>
        {/* 合规脚注：保持极弱视觉权重，不抢上方三个核心数据卡片的焦点 */}
        <p className="mt-4 text-xs font-normal leading-relaxed text-gray-400">
          数据来自已交付的选品诊断项目；客户名称与可识别信息均已脱敏。
        </p>
      </PageHero>

      {/* 核心案例区：只呈现已发生的结果 */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading
            tag="已交付案例"
            title="三个已经跑通的场景"
            desc="客户身份、遇到的问题、调用了中控台的哪部分数据、最后落到什么数字，都在下面。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {CASES.map((c) => (
              <Card key={c.no} className="card-hover h-full border-brand-orange/10">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[11px] font-bold tracking-[0.16em] text-brand-orange-ink">
                      {c.no}
                    </span>
                    {c.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="font-medium">
                        {t}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">客户痛点</p>
                    <p className="mt-1.5 text-sm leading-relaxed">{c.pain}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">我们的数据方案</p>
                    <p className="mt-1.5 text-sm leading-relaxed">{c.solution}</p>
                  </div>

                  <div className="rounded-xl bg-brand-green-soft/75 px-4 py-3.5">
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                      {c.results.map((r) => (
                        <div key={r.label}>
                          <div className="text-2xl font-bold leading-none text-brand-green">
                            {r.value}
                          </div>
                          <div className="mt-1.5 text-xs text-muted-foreground">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-auto border-l-2 border-brand-orange/40 pl-3 text-sm italic leading-relaxed">
                    「{c.quote}」
                    <footer className="mt-2 text-xs not-italic text-muted-foreground">
                      — {c.author}
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 底部统一加微大卡片：全站唯一转化收口，无表单 */}
      <WecomCtaCard
        title="你的品类，有没有被数据忽略的利润空间？"
        from="content"
        subject="数据洞察"
      />
    </>
  );
}
