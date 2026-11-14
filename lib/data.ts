import type { Product, ContentItem, CaseStudy, Partner, Library } from "./types";
import { fetchTable } from "./supabase";

/* ============================================================
   兜底数据：未接入 Supabase 时站点照常运行（demo 模式）。
   接入后以 Supabase products / contents / cases / partners 表为准，
   字段结构见 supabase/migrations/0001_init.sql。
   ============================================================ */

export const FALLBACK_PRODUCTS: Product[] = [
  /* ================= 板块一 · 知识库（免费 / ¥9.9 引流 · 构建行业认知） ================= */
  {
    id: 4, slug: "knowledge-base", name: "避坑指南", icon: "book-open", library: "kb", category: "knowledge",
    positioning: "12,000+ 条踩过的坑，按场景一条条写清楚",
    problem: "名词不懂、政策不清、坑位没人提醒，查资料全靠到处问",
    audience: "刚入行要快速补课的人，和干了多年仍怕踩新坑的老板",
    deliverable: "避坑库 / 名词库 / 适配库 / 政策库 · 内部资料库在线查阅",
    price: "免费 · 联系即得",
    cta_type: "claim", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 8, slug: "full-reports", name: "行业报告", icon: "book", library: "kb", category: "reports",
    positioning: "品类数据、价格带、竞争格局与趋势预判",
    problem: "决策缺数据支撑，拍脑袋交学费",
    audience: "需要决策依据的经营者与平台团队",
    deliverable: "完整报告文档 · 数据来源与口径全部注明",
    price: "¥9.9 · 引流价",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 2, slug: "sop-checklists", name: "合规 SOP 清单", icon: "list-checks", library: "kb", category: "knowledge",
    positioning: "打印出来贴在工位上就能照着做的流程清单",
    problem: "关键流程凭记忆、靠师傅带，动作不标准、结果不稳定",
    audience: "修理厂、经销商、新入行从业者",
    deliverable: "《选品SOP》《平台入驻SOP》《报价核价SOP》《出海合规SOP》等 PDF 清单",
    price: "免费 · 联系即得",
    cta_type: "claim", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 3, slug: "report-briefs", name: "行业报告摘要", icon: "file-text", library: "kb", category: "reports",
    positioning: "核心数据 + 趋势判断 + 一页决策建议",
    problem: "想快速了解行业格局，没时间读完整报告",
    audience: "需要决策参考的经营者",
    deliverable: "PDF 摘要 · 随完整版同步更新",
    price: "免费 · 联系即得",
    cta_type: "claim", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 5, slug: "templates", name: "模板库", icon: "table", library: "kb", category: "knowledge",
    positioning: "一线在用的表格模板，复制过去就能填",
    problem: "想提效但不知道好用的表格长什么样",
    audience: "有现成业务、想立刻提效的团队",
    deliverable: "选品评分表 / 供应商评估表 / 库存周转表 / 客服话术库",
    price: "¥9.9 · 引流价",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 6, slug: "case-library", name: "案例库", icon: "folder-open", library: "kb", category: "knowledge",
    positioning: "真实脱敏案例，每个都附可复用的动作清单",
    problem: "想知道别人是怎么解决同类问题的",
    audience: "想直接看别人怎么解决的务实派",
    deliverable: "图文案例 · 内部资料库专栏",
    price: "免费 · 申请解锁",
    cta_type: "claim", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 1, slug: "content-ip", name: "内容 IP", icon: "video", library: "kb", category: "knowledge",
    positioning: "全网同名「汽配知识局」的短视频、图文与直播",
    problem: "不了解我们，想先通过内容判断专业度",
    audience: "所有汽配人，尤其是想先看看再决定的人",
    deliverable: "短视频 / 深度图文 / 月度直播（回放沉淀进知识库）",
    price: "免费 · 全网公开",
    cta_type: "claim", third_party_url: null, third_party_platform: null, planet_url: null,
  },

  /* ================= 板块二 · 工具库（¥99 – ¥299 · 现成工具，直接落地） ================= */
  {
    id: 14, slug: "toolkit-selection", name: "选品评分表", icon: "calculator", library: "tools", category: "knowledge",
    positioning: "把「要不要进这批货」变成一张能算出分数的表",
    problem: "选品靠感觉，同一个品类这次赚下次亏，说不清为什么",
    audience: "每周要做选品决策的卖家与采购",
    deliverable: "五维评分表（自动算分）+ 测款记录表 + 复盘模板 · Excel / 在线表格双版本",
    price: "¥199",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 15, slug: "toolkit-pricing", name: "核价毛利计算器", icon: "coins", library: "tools", category: "knowledge",
    positioning: "算清楚到手多少钱，别再卖一单亏一单",
    problem: "定价时漏算汇率、佣金、物流与退货，账面赚钱实际亏",
    audience: "做出海与多平台经营的卖家",
    deliverable: "成本核算表 + 汇率折算器 + 毛利校验表 + 定价决策卡",
    price: "¥299",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 16, slug: "toolkit-fitment", name: "适配校验表", icon: "scan-search", library: "tools", category: "knowledge",
    positioning: "按三层校验法，把适配数据一条条过一遍",
    problem: "适配数据错了，退货、差评、压货一起来，一次就赔掉几个月利润",
    audience: "被适配问题反复拖住的团队与修理厂",
    deliverable: "交叉验证清单 + 存疑标记表 + 一线回测记录表 + 专家复核申请模板",
    price: "¥299",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 17, slug: "toolkit-inventory", name: "库存周转模板", icon: "boxes", library: "tools", category: "knowledge",
    positioning: "把压在仓库里的钱算清楚，再决定清还是留",
    problem: "滞销 SKU 占压资金，但不知道该清哪些、清多少、走什么渠道",
    audience: "有现货库存的经销商与修理厂",
    deliverable: "安全库存模型 + 滞销分级表 + 渠道分流方案表 + 月度盘库 SOP",
    price: "¥199",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },

  /* ================= 板块三 · 数据库（¥999 / 年 · 核心，看透真实利润） ================= */
  {
    id: 9, slug: "data-subscription", name: "金游智库·专属查询账号", icon: "line-chart", library: "data", category: "reports",
    positioning: "开通金游智库专属查询账号，看透真实利润",
    problem: "利润被错配、错价、错货源一点点吃掉，账上看着赚钱，实际在亏",
    audience: "要把利润算清楚的卖家、经销商与修理厂",
    deliverable: "金游智库 Client 只读账号（一人一号）+ 312 万 SKU 检索 + OE 号匹配 + 万家供货商评级，无限次查询",
    price: "¥999 / 年",
    cta_type: "buy", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },

  /* ================= 定制合作（不占三库板块，单列） ================= */
  {
    id: 10, slug: "consulting", name: "咨询方案", icon: "compass", library: "custom", category: "consulting",
    positioning: "诊断 + 方案 + 陪跑，只给可落地的动作",
    problem: "有明确的经营问题要解决，缺外部视角与方法",
    audience: "修理厂连锁、经销商集团、成长期卖家",
    deliverable: "诊断报告 + 分阶段路线图 + 月度复盘陪跑",
    price: "¥30,000 起 / 项目",
    cta_type: "consult", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  {
    id: 12, slug: "saas-cooperation", name: "SaaS 工具合作", icon: "wrench", library: "custom", category: "partners",
    positioning: "我们出行业 Know-how 与种子用户，你出产品力",
    problem: "工具好，但打不进汽配行业、缺场景验证",
    audience: "有成熟产品的 SaaS 团队",
    deliverable: "联合运营 / 内容共建 / 种子用户计划",
    price: "面议 · 分成或共建",
    cta_type: "consult", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
  {
    id: 13, slug: "ai-data", name: "AI 数据标注 / 模型训练", icon: "bot", library: "custom", category: "partners",
    positioning: "汽配领域语料授权、标注规则与评测标准共建",
    problem: "通用模型答不准汽配问题，缺行业语料与评测尺子",
    audience: "AI 公司、大模型厂商、研究机构",
    deliverable: "语料授权（签 DPA）/ 标注规则 / 评测标准共建",
    price: "定制报价 · 签正式协议",
    cta_type: "consult", third_party_url: null, third_party_platform: "企业微信", planet_url: null,
  },
];

export const FALLBACK_CONTENTS: ContentItem[] = [
  { id: 1, title: "刹车片选品避坑：这 3 种货打死不能进", type: "短视频", platform: "抖音", link: "#", summary: "选品避坑、货源鉴别。", metric: "42万播放", date: "3 天前" },
  { id: 2, title: "跨境汽配爆款拆解：利润藏在适配数据里", type: "短视频", platform: "B站", link: "#", summary: "跨境选品逻辑拆解。", metric: "18万播放", date: "1 周前" },
  { id: 3, title: "电商渠道汽配类目 2026 价格带全景图", type: "图文", platform: "公众号", link: "#", summary: "价格带分析与决策参考。", metric: "1.2万阅读", date: "2 天前" },
  { id: 4, title: "修理厂供应链怎么理：一场直播讲透", type: "直播回放", platform: "视频号", link: "#", summary: "供应链全流程直播。", metric: "8600 观看", date: "上周" },
  { id: 5, title: "适配数据踩坑实录：一个 SKU 赔掉 2 万块", type: "图文", platform: "公众号", link: "#", summary: "真实踩坑复盘。", metric: "2.4万阅读", date: "1 周前" },
  { id: 6, title: "和修理厂老板聊进货：他一年省了 18 万", type: "短视频", platform: "抖音", link: "#", summary: "真实对话访谈。", metric: "65万播放", date: "2 周前" },
];

export const FALLBACK_CASES: CaseStudy[] = [
  {
    id: 1, client: "12 家连锁修理厂", group: "修理厂与经销商",
    problem: "散采为主，价格混乱、断货频发。",
    solution: "集中采购目录 + 核心供应商分级 + 库存周转 SOP。",
    metrics: [{ label: "采购成本", value: "-18%" }, { label: "断货率", value: "23%→6%" }],
  },
  {
    id: 2, client: "区域经销商", group: "修理厂与经销商",
    problem: "滞销 SKU 占压资金超百万。",
    solution: "滞销分级 + 渠道分流方案 + 安全库存模型。",
    metrics: [{ label: "滞销清空率", value: "68%" }, { label: "资金周转率", value: "+35%" }],
  },
  {
    id: 3, client: "跨境平台团队", group: "从业者与团队",
    problem: "按人民币售价核算，实际持续亏损。",
    solution: "汇率折算修正 + 适配数据三层校验 + SKU 精简。",
    metrics: [{ label: "毛利率", value: "-5%→+21%" }, { label: "SKU 数量", value: "-60%" }],
  },
  {
    id: 4, client: "新卖家小团队", group: "从业者与团队",
    problem: "凭感觉选品，爆款全靠运气。",
    solution: "选品五维评分法 + 每周数据复盘 + 测款流程标准化。",
    metrics: [{ label: "测款通过率", value: "×2.3" }, { label: "体系跑通周期", value: "4 周" }],
  },
  {
    id: 5, client: "平台类目团队", group: "平台企业与AI",
    problem: "类目评估靠人工翻平台，慢且口径不一。",
    solution: "接入订阅数据看板 + 评估模板标准化。",
    metrics: [{ label: "单品类评估", value: "3天→4小时" }, { label: "爆款命中率", value: "×2.6" }],
  },
  {
    id: 6, client: "大模型厂商", group: "平台企业与AI",
    problem: "通用模型答汽配问题错误率高。",
    solution: "汽配评测集共建 + 标注规则输出 + 专家复核。",
    metrics: [{ label: "评测条目", value: "5000+" }, { label: "垂直准确率", value: "+31%" }],
  },
];

export const FALLBACK_PARTNERS: Partner[] = [
  { id: 1, name: "元卦云仓供应链", cooperation_type: "一线数据来源 · 自营" },
  { id: 2, name: "元卦 · 汽配跨境", cooperation_type: "一线数据来源 · 自营" },
  { id: 3, name: "Chuer 汽配", cooperation_type: "一线数据来源 · 自营" },
  { id: 4, name: "修合汽配", cooperation_type: "一线数据来源 · 自营" },
  { id: 5, name: "Gengua 重卡·摩托·船艇", cooperation_type: "一线数据来源 · 自营" },
  { id: 6, name: "博盖 Auto", cooperation_type: "一线数据来源 · 自营" },
];

/* ---------- 服务端数据入口（Supabase 优先，兜底降级） ---------- */

/* ============================================================
   交付口径清洗（2026-10-27）

   数据库里还留着历史文案：「知识星球课程」「小鹅通录播」等。
   全站已不接入任何第三方平台，因此在**读取层**统一改写一次，
   保证页面上绝不出现旧平台名——不改数据库也能立刻生效。
   配套 SQL：supabase/migrations/0007_wecom_only.sql（可选执行，用于彻底清库）。
   ============================================================ */
const DELIVERY_REPLACERS: Array<[RegExp, string]> = [
  [/知识星球课程/g, "内部资料"],
  [/培训课程|体系课|录播课/g, "数据库"],
  [/企业内训|定制内训/g, "定制咨询"],
  [/课程/g, "数据工具"],
  [/知识星球/g, "企业微信"],
  [/小鹅通/g, "企业微信"],
  [/Baklib\s*\/?\s*飞书/g, "内部资料库"],
  [/Baklib/g, "内部资料库"],
  // —— 去具体平台化（2026-10-28）：官网保持中立，不点名任何销售渠道 ——
  // 先折叠「Ozon / eBay / Temu」这类并列列举，避免变成「跨境平台 / 跨境平台 / 跨境平台」
  [
    /(?:Ozon|eBay|Temu|Jumia|Amazon|亚马逊|速卖通|Shopee|Lazada|Walmart|Wish|SHEIN)(?:\s*(?:\/|、|,|，|与|和)\s*(?:Ozon|eBay|Temu|Jumia|Amazon|亚马逊|速卖通|Shopee|Lazada|Walmart|Wish|SHEIN))+/gi,
    "多个跨境平台",
  ],
  [/(?:Ozon|eBay|Temu|Jumia|Amazon|亚马逊|速卖通|Shopee|Lazada|Walmart|Wish|SHEIN)/gi, "跨境平台"],
  [/拼多多|淘宝|天猫|京东/g, "电商渠道"],
  // —— 官方邮箱统一（2026-11-05）：数据库历史文案里的旧域名/占位邮箱一律改写 ——
  [/[A-Za-z0-9._%+-]+@(?:qipeizhishiju|qipeizhishi)\.com/gi, "service@jinyoudata.com"],
  [/[A-Za-z0-9._%+-]+@yourdomain\.com/gi, "service@jinyoudata.com"],
];

function sanitizeText<T>(v: T): T {
  if (typeof v !== "string") return v;
  const text = String(v);
  return DELIVERY_REPLACERS.reduce(
    (acc, [re, to]) => acc.replace(re, to),
    text
  ) as T;
}

/** 对一行的所有字符串字段做清洗（只动 string，其他原样返回） */
function sanitizeRow<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = { ...row };
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (typeof v === "string") out[k] = sanitizeText(v);
  }
  return out as T;
}

/** 已下线的产品 slug：即使数据库里还有旧记录，也不允许再出现在站点上 */
const RETIRED_PRODUCT_SLUGS = new Set(["courses", "annual-pass", "corporate-training"]);

/**
 * 代码里的产品目录 = 唯一真源（2026-11-14 三库定调，全站封板）。
 *
 * 背景：官网的产品数据来自 Supabase products 表，但库里还留着改版前的
 * 名字、价格与旧的 tier 枚举（如「订阅数据产品 ¥699」、tier=course）。
 * 只要库里有一条 tier 不在枚举内，整块板块就会消失（第三档曾经整块空掉）。
 *
 * 所以读取层改为：已知 slug 一律用代码目录（名称 / 定价 / 归类 / 文案），
 * 数据库只用来补充尚未进目录的额外条目，并按旧 tier 归到对应板块。
 * 这样官网不会因为库里的历史数据而回潮，也不会再有板块消失。
 */
const CANONICAL_BY_SLUG = new Map(FALLBACK_PRODUCTS.map((p) => [p.slug, p]));

/** 旧 tier 枚举 → 三库板块（只为兼容数据库历史数据） */
const LEGACY_TIER_TO_LIBRARY: Record<string, Library> = {
  free: "kb",
  toolkit: "tools",
  subscription: "data",
  enterprise: "custom",
  course: "data",
  courses: "data",
};

function legacyLibrary(raw: unknown): Library {
  return LEGACY_TIER_TO_LIBRARY[String(raw ?? "")] ?? "custom";
}

/** 数据库里额外新增（不在代码目录里）的产品：只借用它自己的文案，归类按旧 tier 推 */
function fromDatabaseRow(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id ?? 0),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    icon: String(row.icon ?? "file-text"),
    library: legacyLibrary(row.library ?? row.tier),
    category: String(row.category ?? "knowledge"),
    positioning: String(row.positioning ?? ""),
    problem: String(row.problem ?? ""),
    audience: String(row.audience ?? ""),
    deliverable: String(row.deliverable ?? ""),
    price: String(row.price ?? ""),
    cta_type: (row.cta_type as Product["cta_type"]) ?? "claim",
    third_party_url: null,
    third_party_platform: null,
    planet_url: null,
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = (await fetchTable<Record<string, unknown>>("products")) ?? [];
  const extras = rows
    .filter((r) => typeof r.slug === "string")
    .filter((r) => !CANONICAL_BY_SLUG.has(String(r.slug)))
    .filter((r) => !RETIRED_PRODUCT_SLUGS.has(String(r.slug)))
    .map(fromDatabaseRow)
    .filter((p) => p.slug && p.name);

  return [...FALLBACK_PRODUCTS, ...extras].map(
    (p) => sanitizeRow(p as unknown as Record<string, unknown>) as unknown as Product
  );
}
export async function getContents(): Promise<ContentItem[]> {
  const rows = (await fetchTable<ContentItem>("contents")) ?? FALLBACK_CONTENTS;
  return rows.map((r) => sanitizeRow(r as unknown as Record<string, unknown>) as unknown as ContentItem);
}
export async function getCases(): Promise<CaseStudy[]> {
  const rows = (await fetchTable<CaseStudy>("cases")) ?? FALLBACK_CASES;
  return rows.map((r) => sanitizeRow(r as unknown as Record<string, unknown>) as unknown as CaseStudy);
}
export async function getPartners(): Promise<Partner[]> {
  const rows = (await fetchTable<Partner>("partners")) ?? FALLBACK_PARTNERS;
  return rows.map((r) => sanitizeRow(r as unknown as Record<string, unknown>) as unknown as Partner);
}
