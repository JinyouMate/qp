import Link from "next/link";
import {
  ArrowRight, CalendarClock, Building2, Factory, Bot, ShoppingCart,
  CheckCircle2, ShieldCheck, Quote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { HeroDataBoard } from "@/components/site/hero-data-board";
import { WecomCtaButton } from "@/components/site/wecom-dialog";
import { LeadSection } from "@/components/site/lead-section";
import { Faq } from "@/components/site/faq";
import { ProductLadder } from "@/components/site/product-ladder";
import { JsonLd, faqSchema } from "@/components/site/json-ld";
import { getProducts, getContents, getCases } from "@/lib/data";

/* ---------- 数字统计信任区（底层数据资产口径，只用自有数据） ---------- */
const TRUST_STATS = [
  { value: "3,124,045+", label: "底层 SKU 库" },
  { value: "931+", label: "源头供应商直连" },
  { value: "2,219+", label: "主流品牌覆盖" },
  { value: "28.03%", label: "平均毛利空间" },
];

/* ---------- 底层数据资产看板：4 个硬核指标 + 3 张图 + 转化 CTA ---------- */
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

/* ---------- 四类入口（点击后进入对应身份的产品筛选 / 或直接弹企微码） ----------
   排序原则：把「零售/跨境卖家」放第一位（转化主路径，橙色高亮 + 专属按钮），
   修理厂与汽配商已合并为一张卡，避免同类身份重复占位。                       */
const ENTRIES = [
  {
    icon: ShoppingCart,
    role: "seller" as const,
    highlight: true, // C 位：核心获客人群，橙色高亮
    title: "零售 / 跨境卖家",
    need: "退货率、选品、合规三重压力",
    pain: "还在盲选选品？还在被高退货率折磨？我们的数据能帮你提前排雷。",
    give: "包含 312 万+ SKU 的选品逻辑、黄金毛利区间表与平台合规 SOP。",
    cta: "获取完整方案",
    action: "wecom" as const,
  },
  {
    icon: Building2,
    role: "shop" as const,
    title: "修理厂 / 汽配商",
    need: "解决具体业务问题 / 系统搭建认知体系",
    pain: "采购乱、压资金？干货看了没体系、没方法？",
    give: "源头供应商白名单、库存周转模板与真实大盘定价参考。",
    cta: "获取完整方案",
    action: "wecom" as const,
  },
  {
    icon: Factory,
    role: "enterprise" as const,
    title: "平台 / 企业",
    need: "想合作数据产品",
    pain: "类目评估靠人工翻平台，慢、口径乱、结论不可复用。",
    give: "订阅数据看板 + 评估模板 + 定制报告",
    cta: "申请内测席位",
    action: "wecom" as const,
  },
  {
    icon: Bot,
    role: "ai" as const,
    title: "AI 公司",
    need: "想合作行业数据",
    pain: "通用模型答不准汽配问题，缺语料、缺标注规则、缺评测尺子。",
    give: "语料授权（签 DPA）+ 标注规则 + 评测集共建",
    cta: "获取完整方案",
    action: "wecom" as const,
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

/* ---------- FAQ ---------- */
const FAQS = [
  {
    q: "你们是卖货的吗？会推销产品吗？",
    a: "不卖货。我们是知识资产运营商，只做知识、数据、方法与工具。不代运营、不碰交易、不收佣金。文中出现的品牌与数据都是为说明方法服务，不构成推荐。",
  },
  {
    q: "为什么获取资料需要留联系方式？",
    a: "两件事：一是资料本身要发给你；二是我们想知道哪类内容对哪类人有用，好决定下一步做什么。信息只用于资料发送与业务联系，可以随时要求删除，详见隐私政策。",
  },
  {
    q: "免费资料和付费内容差在哪？",
    a: "免费的是「清单与结论」——你能直接照着做；付费的是「体系与数据」——包括完整方法论、持续更新的数据集、答疑与批改。前者给动作，后者给能力。",
  },
  {
    q: "课程和内部资料库在哪看？",
    a: "统一在企业微信。扫码添加后系统自动下发内部资料库链接，并邀请你加入行业交流群。官网不处理支付、不跳转任何第三方平台。",
  },
  {
    q: "AI 数据合作怎么保证合规？",
    a: "所有语料授权签署正式协议与数据处理附录（DPA），明确用途、期限与删除机制；涉及客户业务数据的一律先脱敏，不出原始单号、价格与客户信息。可以先看我们的数据合规说明再谈。",
  },
  {
    q: "能先试试再决定吗？",
    a: "可以。SOP 清单、报告摘要、模板库免费；订阅数据产品支持 7 天试用；咨询先做一次免费 30 分钟诊断，判断我们能不能真的帮上忙，不能会直说。",
  },
  {
    q: "案例里的数据是真的吗？",
    a: "是真的，但已做脱敏与客户授权处理，不出现客户名称与可识别信息。每个案例都标注了口径与时间范围，不做「提升 300%」这类无口径表述。",
  },
];

export default async function HomePage() {
  const [products, contents, cases] = await Promise.all([
    getProducts(),
    getContents(),
    getCases(),
  ]);

  const homeCases = cases.slice(0, 3);

  return (
    <>
      {/* 首页结构化数据：FAQPage（其余 Organization/WebSite 在 layout） */}
      <JsonLd data={faqSchema(FAQS)} />

      {/* ========== Hero ========== */}
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
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <WecomCtaButton
                  size="lg"
                  variant="default"
                  label="获取完整方案"
                  from="home-hero"
                  subject="首页"
                />
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact?intent=consult">
                    <CalendarClock /> 预约咨询
                  </Link>
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["不卖货 · 不代运营", "官网不处理支付", "数据合规第一天就有"].map((t, i) => (
                  <li key={t} className="flex items-center gap-1.5">
                    {/* 木 / 火交替：小图标不要再一片冷绿 */}
                    <CheckCircle2
                      className={`h-4 w-4 ${i % 2 === 0 ? "text-brand-green" : "text-brand-orange"}`}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* 右侧视觉：纯前端绘制的悬浮数据看板（无图片、无截图） */}
            <HeroDataBoard />
          </div>
        </div>
      </section>

      {/* ========== 数字统计信任区 ========== */}
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

      {/* ========== 四类入口 ========== */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading
            tag="四类访客入口"
            title="你是谁，直接走对应的路"
            desc="不用在九类产品里翻。选一个身份，我们把你该看的、该拿的、该问的排好顺序。"
          />

          {/*
            排版：手机 1 列纵向 4 张；≥640px 起 2×2 宫格。
            第 1 张（零售/跨境卖家）固定在左上角，是视线第一落点。
          */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ENTRIES.map((e) => (
              <Card
                key={e.title}
                className={`card-hover flex h-full flex-col ${
                  e.highlight ? "border-brand-orange/40 shadow-warm" : ""
                }`}
              >
                {/* 手机：图标→文案→按钮纵向；≥lg：图标 | 文案 | 按钮 横向，避免宽卡留白 */}
                <CardContent className="flex flex-1 flex-col gap-3 p-5 lg:flex-row lg:items-center lg:gap-5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      e.highlight
                        ? "bg-brand-orange-soft text-brand-orange-ink"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    <e.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>

                  <div className="flex flex-1 flex-col gap-2">
                    <div>
                      <h3 className="text-base font-bold">{e.title}</h3>
                      <p className="text-xs text-brand-orange-ink">{e.need}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{e.pain}</p>
                    <p className="rounded-lg bg-brand-cream p-3 text-xs leading-relaxed">
                      <span className="font-semibold">你会拿到：</span>
                      {e.give}
                    </p>
                  </div>

                  {e.action === "wecom" ? (
                    <WecomCtaButton
                      label={e.cta}
                      size="sm"
                      variant={e.highlight ? "orange" : "default"}
                      from={`entry-${e.role}`}
                      subject={e.title}
                      className="mt-auto w-full lg:mt-0 lg:w-40 lg:shrink-0"
                    />
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      variant="default"
                      className="mt-auto w-full lg:mt-0 lg:w-40 lg:shrink-0"
                    >
                      <Link href={`/products?role=${e.role}`}>
                        {e.cta} <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 底层数据资产看板 ========== */}
      <section className="section-pad border-y border-brand-green/10 bg-brand-green-soft/35">
        <div className="container-site">
          <SectionHeading
            tag="数据中台 · 11 个月真实大盘"
            title="底层数据资产看板"
            desc="我们不打价格战，我们用数据帮你找蓝海。"
          />

          {/* 模块 1：四大硬核指标（手机 2×2，PC 一排 4 个） */}
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
            模块 2：数据洞察图表
            排版：手机纵向依次排列（自然滑动）；≥lg 三张并列。
            图片位：public/data/chart-monthly-sku.png / chart-top-brands.png / chart-margin-distribution.png
            直接覆盖同名文件即可替换成真实高清截图，代码无需改动。
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

          {/* 模块 3：全宽浅暖色转化 Banner（洗去深色，保留火系焦点） */}
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-brand-orange/20 bg-gradient-to-br from-[#FFF7EE] via-[#FDFAF5] to-[#F1F7F2] px-6 py-10 md:px-12 md:py-12">
            {/* 极淡暖色网格纹理，做出数据中台质感 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(31,111,74,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,111,74,0.07) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "radial-gradient(120% 100% at 80% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(120% 100% at 80% 0%, #000 20%, transparent 75%)",
              }}
            />
            <div aria-hidden className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-brand-orange/[0.07] blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold leading-snug md:text-2xl">
                  想要获取基于这套系统的完整选品清单？
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {"我们已为你打包好 "}
                  <span className="font-semibold text-brand-orange-ink">
                    【本周 Top 50 高毛利（&gt;40%）汽配选品包（脱敏版）】
                  </span>
                  {"，涵盖真实适配车型与建议售价。"}
                </p>
              </div>
              <WecomCtaButton
                label="申请获取数据内测席位"
                size="lg"
                variant="orange"
                from="data-board-banner"
                subject="底层数据资产看板"
                className="w-full shrink-0 shadow-none md:w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== 产品四层 ========== */}
      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading
            tag="产品分层"
            title="四层产品，一次只上一层"
            desc="流量层免费 → 信任层低门槛 → 转化层付费 → 交付层定制。先用免费的把问题解决一次，用得上再往上走。"
          />
          <ProductLadder products={products} groupBy="layer" limitPerRow={3} />
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/products">
                查看完整产品中心与价格 <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== 最新内容 IP ========== */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading
            tag="内容 IP"
            title="先看内容，再判断我们靠不靠谱"
            desc="全网同名「汽配知识局」。内容都在公域，判断完再决定要不要留资。"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contents.slice(0, 6).map((c) => (
              <Card key={c.id} className="card-hover h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{c.type}</Badge>
                    <span className="text-muted-foreground">{c.platform}</span>
                    <span className="ml-auto font-semibold text-brand-orange-ink">{c.metric}</span>
                  </div>
                  <h3 className="text-[15px] font-bold leading-snug">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.summary}</p>
                  <p className="mt-auto pt-2 text-xs text-muted-foreground">{c.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/content">
                全部内容 <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/insights">
                读方法长文（OE号匹配 / VIN解析 / 出海合规） <ArrowRight />
              </Link>
            </Button>
          </div>
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
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/cases">
                看全部案例 <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== 方法论：浅绿底 + 白卡，洗去深墨绿 ========== */}
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
            完整方法论与校验记录模板，留资后随知识库一并开放
          </p>
        </div>
      </section>

      {/* ========== 留资 CTA ========== */}
      <LeadSection />

      {/* ========== FAQ ========== */}
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="常见问题" title="你可能想先问清楚的事" />
          <div className="mx-auto max-w-3xl">
            <Faq items={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
