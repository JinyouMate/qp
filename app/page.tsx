import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { HeroDataBoard } from "@/components/site/hero-data-board";
import { WecomCtaButton } from "@/components/site/wecom-dialog";
import { WecomCtaCard } from "@/components/site/wecom-cta-card";
import { getCases } from "@/lib/data";

/* 首页只做两件事：用数据证明，用加微收口。 */

/* ---------- 数字统计信任区（底层数据资产口径，只用自有数据） ---------- */
const TRUST_STATS = [
  { value: "3,124,045+", label: "底层 SKU 库" },
  { value: "931+", label: "源头供应商直连" },
  { value: "2,219+", label: "主流品牌覆盖" },
  { value: "28.03%", label: "平均毛利空间" },
];

/* ---------- 底层数据资产看板：4 个硬核指标 + 3 张图 ---------- */
const DATA_METRICS = [
  { value: "3,124,045+", label: "SKU 底层明细总数" },
  { value: "1,618,701+", label: "去重商品数" },
  { value: "2,219+", label: "覆盖主流汽配品牌" },
  { value: "28.03%", label: "大盘平均毛利率" },
];

/* 图片位：直接覆盖 public/data/ 下的同名文件即可换成真实截图，代码不用改 */
const DATA_CHARTS = [
  {
    src: "/data/chart-monthly-sku.png",
    title: "月度 SKU 与供应商趋势",
    caption: "实时监控上千家源头供应商的上架与淘汰动态。",
    alt: "月度 SKU 与供应商趋势图：11 个月大盘 SKU 规模与供应商数量走势",
  },
  {
    src: "/data/chart-top-brands.png",
    title: "Top 15 主流品牌覆盖",
    caption: "深度解析丰田、宝马、MEKEDE 等核心品牌的适配逻辑。",
    alt: "Top 15 主流品牌覆盖图：SKU 覆盖量排名前 15 的品牌",
  },
  {
    src: "/data/chart-margin-distribution.png",
    title: "黄金毛利区间分布",
    caption: "精准锁定 40%-50% 利润带，帮你避开高退货率雷区。",
    alt: "黄金毛利区间分布图：各毛利率区间的商品数量分布",
  },
];

/* ---------- 方法论：汽配数据三层校验法 ---------- */
const METHOD_STEPS = [
  {
    step: "第一层",
    name: "交叉验证",
    desc: "同一条适配/价格数据至少来自两个独立来源（平台前台 + 供应商目录 + 自有成交记录），对不上就标记为存疑，不进库。",
    color: "bg-brand-green",
  },
  {
    step: "第二层",
    name: "一线回测",
    desc: "存疑与高频条目送回自有云仓与修理厂场景实测，用真实装车/退货结果校准，而不是只靠文档推断。",
    color: "bg-brand-orange",
  },
  {
    step: "第三层",
    name: "专家复核",
    desc: "由 5 年以上品类经验的工程师做最终复核并署名，每条数据可追溯到「谁在什么时候依据什么确认的」。",
    color: "bg-brand-red",
  },
];

const HERO_OFFER = "免费领取：Top 50 高毛利选品清单（内测版）";

export default async function HomePage() {
  const cases = await getCases();
  const homeCases = cases.slice(0, 3);

  return (
    <>
      {/* ========== Hero：唯一主目标 ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF7EE] via-[#FCFAF6] to-background">
        <div className="container-site py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
            <div>
              <Badge variant="accent" className="mb-4">
                汽配行业 · 知识资产运营商
              </Badge>
              <h1 className="text-3xl font-bold leading-[1.25] md:text-5xl">
                把隐性知识
                <span className="relative mx-1 inline-block text-brand-red">
                  变成可交易资产
                  <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-brand-orange/30" />
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                基于 312 万条真实汽配交易数据与 900+ 家源头供应商，
                我们为你拆解出锁定 40%-50% 黄金毛利区间的选品逻辑与合规 SOP。
              </p>

              {/* 首屏唯一按钮：点击直接弹主理人企微名片，不跳页、不填表 */}
              <div className="mt-8">
                <WecomCtaButton
                  size="lg"
                  variant="orange"
                  label={HERO_OFFER}
                  from="home-hero"
                  subject={HERO_OFFER}
                  className="h-14 w-full whitespace-normal text-center text-base font-bold leading-snug shadow-warm-lg sm:w-auto sm:text-lg md:h-16 md:px-10 md:text-xl"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  点击扫码，直接获取内测资料
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["不卖货 · 不代运营", "官网不处理支付", "数据合规第一天就有"].map((t, i) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`h-4 w-4 ${i % 2 === 0 ? "text-brand-green" : "text-brand-orange"}`}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* 右侧视觉：纯前端绘制的悬浮数据看板（保持不动） */}
            <HeroDataBoard />
          </div>
        </div>
      </section>

      {/* ========== 数字统计信任区（保持不动） ========== */}
      <section className="border-y bg-white/60">
        <div className="container-site py-10">
          <p className="mb-6 text-center text-sm font-semibold tracking-wide text-muted-foreground">
            底层数据资产 · 自有库全量盘点口径，不讲空话
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <Card key={s.label} className="card-hover h-full">
                <CardContent className="flex flex-col items-center justify-center gap-1.5 p-5 text-center">
                  <div className="whitespace-nowrap font-bold text-brand-green text-[clamp(20px,5.2vw,36px)] leading-tight">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground md:text-sm">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 底层数据资产看板：纯数据证明，不再放并列 CTA ========== */}
      <section className="section-pad border-y border-brand-green/10 bg-brand-green-soft/35">
        <div className="container-site">
          <SectionHeading
            tag="数据中台 · 11 个月真实大盘"
            title="底层数据资产看板"
            desc="我们不打价格战，我们用数据帮你找蓝海。"
          />

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {DATA_METRICS.map((m) => (
              <Card
                key={m.label}
                className="card-hover card-hover-green h-full border-brand-green/10 bg-white/90 shadow-[0_1px_2px_rgba(16,45,32,0.04)]"
              >
                <CardContent className="flex h-full flex-col items-center justify-center gap-2 px-3 py-7 text-center">
                  <div className="whitespace-nowrap font-bold leading-none tracking-tight text-brand-green text-[clamp(22px,5.6vw,34px)]">
                    {m.value}
                  </div>
                  <div className="text-[11px] leading-snug text-muted-foreground md:text-xs">
                    {m.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/*
            数据洞察图表：手机纵向依次排列，≥lg 三张并列。
            图片位：public/data/chart-*.png，覆盖同名文件即可替换。
          */}
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {DATA_CHARTS.map((c) => (
              <Card
                key={c.src}
                className="card-hover flex h-full flex-col overflow-hidden rounded-2xl border-border bg-white shadow-warm"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.alt}
                    width={960}
                    height={600}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-[15px] font-bold text-brand-green">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand-green" />
            数据口径：11 个月连续观测 · 161.8 万+ 去重商品 · 312 万条底层 SKU · 每条结论均可回溯原始记录
          </p>
        </div>
      </section>

      {/* ========== 极简横向服务 Banner（替代原「四层产品」） ========== */}
      <section className="border-y border-brand-orange/20 bg-brand-cream">
        <div className="container-site flex flex-col items-start gap-5 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:py-10">
          <p className="text-base font-medium leading-relaxed md:text-lg">
            想直接获取完整数据包或定制诊断服务？请添加主理人获取全系报价单。
          </p>
          <Button asChild variant="outline" size="default" className="shrink-0">
            <Link href="/products">
              查看完整服务目录 <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* ========== 案例证据 ========== */}
      <section className="section-pad bg-white/60">
        <div className="container-site">
          <SectionHeading
            tag="案例证据"
            title="不吹牛，只看结果数据"
            desc="以下案例均经客户授权并脱敏，标注了统计口径与时间范围。"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {homeCases.map((c) => (
              <Card key={c.id} className="card-hover h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                    <Quote className="h-4 w-4" />
                    {c.client}
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-muted-foreground">问题：</span>
                      {c.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-muted-foreground">方案：</span>
                      {c.solution}
                    </p>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2 border-t border-dashed pt-3">
                    {c.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-lg font-bold text-brand-red">{m.value}</div>
                        <div className="text-xs text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 方法论：浅绿底 + 白卡 ========== */}
      <section className="section-pad border-y border-brand-green/10 bg-brand-green-soft/45">
        <div className="container-site">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-2 block text-xs font-semibold tracking-[0.25em] text-brand-orange-ink">
              命名化方法论
            </span>
            <h2 className="text-2xl font-bold md:text-3xl">
              汽配数据三层校验法
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-[15px]">
              汽配数据的坑不在「有没有」，而在「准不准」。一条适配数据错了，
              后面选品、报价、客服全错。三层校验是我们所有数据产品的底座。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {METHOD_STEPS.map((s) => (
              <div key={s.step} className="card-hover card-hover-green rounded-xl border border-brand-green/10 bg-white p-5 shadow-warm">
                <span className={`mb-3 inline-block rounded-full ${s.color} px-3 py-1 text-xs font-bold text-white`}>
                  {s.step}
                </span>
                <h3 className="text-lg font-bold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-brand-green" />
            完整方法论与校验记录模板，添加主理人后随知识库一并开放
          </p>
        </div>
      </section>

      {/* ========== 底部唯一大 CTA：全站统一组件，无表单，只弹企微名片 ========== */}
      <WecomCtaCard
        badge="免费 · 内测版"
        desc="312 万条真实 SKU、40%-50% 黄金毛利带，已经整理成一份能直接照着做的清单。"
        from="home-bottom-cta"
        subject="首页底部行动区"
        showQr={false}
      />
    </>
  );
}
