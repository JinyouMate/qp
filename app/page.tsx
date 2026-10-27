import Link from "next/link";
import {
  ArrowRight, Gift, CalendarClock, Building2, Store, Factory, Bot,
  CheckCircle2, ShieldCheck, Quote, Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Faq } from "@/components/site/faq";
import { ProductLadder } from "@/components/site/product-ladder";
import { JsonLd, faqSchema } from "@/components/site/json-ld";
import { getProducts, getContents, getCases } from "@/lib/data";

/* ---------- 数字统计信任区（只用自有数据，不展示任何第三方品牌 Logo） ---------- */
const TRUST_STATS = [
  { value: "10,000+", label: "条汽配 OE 码解析" },
  { value: "300+", label: "家修理厂与门店调研" },
  { value: "500+", label: "页 SOP 与实操模板" },
  { value: "3", label: "层数据校验法（独家方法论）" },
];

/* ---------- 四类入口（点击后进入对应身份的产品筛选） ---------- */
const ENTRIES = [
  {
    icon: Building2,
    role: "repair" as const,
    title: "修理厂 / 经销商",
    need: "想解决具体问题",
    pain: "散采价格乱、断货频繁、滞销压资金、报价靠拍脑袋。",
    give: "SOP 清单 + 供应商分级方法 + 库存周转模板",
    cta: "看给我的产品",
  },
  {
    icon: Store,
    role: "dealer" as const,
    title: "汽配商 / 从业者",
    need: "想系统学习",
    pain: "干货看了一堆，轮到自己干还是没体系、没方法。",
    give: "基础知识库 + 体系课 + 每周复盘社群",
    cta: "看给我的产品",
  },
  {
    icon: Factory,
    role: "enterprise" as const,
    title: "平台 / 企业",
    need: "想合作数据产品",
    pain: "类目评估靠人工翻平台，慢、口径乱、结论不可复用。",
    give: "订阅数据看板 + 评估模板 + 定制报告",
    cta: "看给我的产品",
  },
  {
    icon: Bot,
    role: "ai" as const,
    title: "AI 公司",
    need: "想合作行业数据",
    pain: "通用模型答不准汽配问题，缺语料、缺标注规则、缺评测尺子。",
    give: "语料授权（签 DPA）+ 标注规则 + 评测集共建",
    cta: "看给我的产品",
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
    q: "为什么领取资料还要留联系方式？",
    a: "两件事：一是资料本身要发给你；二是我们想知道哪类内容对哪类人有用，好决定下一步做什么。信息只用于资料发送与业务联系，可以随时要求删除，详见隐私政策。",
  },
  {
    q: "免费资料和付费内容差在哪？",
    a: "免费的是「清单与结论」——你能直接照着做；付费的是「体系与数据」——包括完整方法论、持续更新的数据集、答疑与批改。前者给动作，后者给能力。",
  },
  {
    q: "课程和知识库在哪个平台看？",
    a: "课程在小鹅通/知识星球，知识库在 Baklib/飞书。官网不处理支付，所有第三方链接都会先引导你加企微或留资，确保后续能找到人。链接均已附加来源参数用于统计。",
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
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green-soft via-background to-background">
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
                从数据到决策，从知识到工具。
                我们把一线汽配人的经验、踩过的坑和真实交易数据，
                整理成查得到、学得会、用得上的知识资产。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="destructive">
                  <Link href="/contact?intent=asset">
                    <Gift /> 领取资料
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact?intent=consult">
                    <CalendarClock /> 预约咨询
                  </Link>
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["不卖货 · 不代运营", "官网不处理支付", "数据合规第一天就有"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* 真实工作场景占位：替换为数据截图 / 工作现场照片 */}
            <div className="figure-ph aspect-[4/3] w-full">
              <Sparkles className="h-7 w-7 text-brand-orange" />
              <p className="px-6 text-center text-sm">
                此处放真实工作场景图：云仓盘点 / 数据看板截图 / 课程现场
                <br />
                <span className="text-xs opacity-70">不使用通用 stock photo</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 数字统计信任区 ========== */}
      <section className="border-y bg-white/60">
        <div className="container-site py-10">
          <p className="mb-6 text-center text-sm font-semibold tracking-wide text-muted-foreground">
            真实数据沉淀，不讲空话
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <Card key={s.label} className="h-full">
                <CardContent className="flex flex-col items-center justify-center gap-1.5 p-5 text-center">
                  <div className="text-3xl font-bold text-brand-green md:text-4xl">{s.value}</div>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ENTRIES.map((e) => (
              <Card key={e.title} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                    <e.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{e.title}</h3>
                    <p className="text-xs text-brand-orange">{e.need}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{e.pain}</p>
                  <p className="rounded-lg bg-brand-cream p-3 text-xs leading-relaxed">
                    <span className="font-semibold">你会拿到：</span>
                    {e.give}
                  </p>
                  <Button asChild size="sm" variant="default" className="mt-auto w-full">
                    <Link href={`/products?role=${e.role}`}>
                      {e.cta} <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
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
              <Card key={c.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{c.type}</Badge>
                    <span className="text-muted-foreground">{c.platform}</span>
                    <span className="ml-auto font-semibold text-brand-orange">{c.metric}</span>
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
              <Card key={c.id} className="h-full">
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

      {/* ========== 方法论 ========== */}
      <section className="section-pad bg-brand-green text-white">
        <div className="container-site">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-2 block text-xs font-semibold tracking-[0.25em] text-brand-orange">
              命名化方法论
            </span>
            <h2 className="text-2xl font-bold md:text-3xl">
              汽配数据三层校验法
            </h2>
            <p className="mt-3 text-sm text-white/80 md:text-[15px]">
              汽配数据的坑不在「有没有」，而在「准不准」。一条适配数据错了，
              后面选品、报价、客服全错。三层校验是我们所有数据产品的底座。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {METHOD_STEPS.map((s) => (
              <div key={s.step} className="rounded-xl bg-white/10 p-5">
                <span className={`mb-3 inline-block rounded-full ${s.color} px-3 py-1 text-xs font-bold`}>
                  {s.step}
                </span>
                <h3 className="text-lg font-bold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" />
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
