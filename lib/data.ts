import type { Product, ContentItem, CaseStudy, Partner } from "./types";
import { fetchTable } from "./supabase";

/* ============================================================
   兜底数据：未接入 Supabase 时站点照常运行（demo 模式）。
   接入后以 Supabase products / contents / cases / partners 表为准，
   字段结构见 supabase/migrations/0001_init.sql。
   ============================================================ */

export const FALLBACK_PRODUCTS: Product[] = [
  // ---------- 流量层（免费 · 认识我们） ----------
  {
    id: 1, slug: "content-ip", name: "内容 IP", icon: "video", layer: "traffic", category: "knowledge", tier: "free",
    positioning: "全网同名「汽配知识局」的短视频、图文与直播",
    problem: "不了解我们，想先通过内容判断专业度",
    audience: "所有汽配人，尤其是想先看看再决定的人",
    deliverable: "短视频 / 深度图文 / 月度直播（回放沉淀知识库）",
    price: "免费 · 全网公开",
    cta_type: "claim", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  {
    id: 2, slug: "sop-checklists", name: "SOP 清单", icon: "list-checks", layer: "traffic", category: "knowledge", tier: "free",
    positioning: "打印出来贴在工位上就能照着做的流程清单",
    problem: "关键流程凭记忆、靠师傅带，动作不标准、结果不稳定",
    audience: "修理厂、经销商、新入行从业者",
    deliverable: "《选品SOP》《平台入驻SOP》《报价核价SOP》等 PDF 清单",
    price: "免费 · 留资即得",
    cta_type: "claim", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  {
    id: 3, slug: "report-briefs", name: "行业报告摘要", icon: "file-text", layer: "traffic", category: "reports", tier: "free",
    positioning: "完整报告的精华版：核心数据 + 趋势判断 + 一页决策建议",
    problem: "想快速了解行业格局，没时间读完整报告",
    audience: "需要决策参考的经营者",
    deliverable: "PDF 摘要 · 随完整版同步更新",
    price: "免费 · 留资即得",
    cta_type: "claim", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  // ---------- 信任层（免费 · 建立信任） ----------
  {
    id: 4, slug: "knowledge-base", name: "基础知识库", icon: "book-open", layer: "trust", category: "knowledge", tier: "free",
    positioning: "12,000+ 条目的行业知识底座",
    problem: "名词不懂、政策不清、坑位没人提醒，查资料全靠到处问",
    audience: "从业者日常查询、新人系统入门",
    deliverable: "名词库 / 适配库 / 政策库 / 避坑库 · Baklib / 飞书在线查阅",
    price: "基础版免费 · 进阶版随社群",
    cta_type: "claim", third_party_url: null, third_party_platform: "Baklib / 飞书", planet_url: null,
  },
  {
    id: 5, slug: "templates", name: "模板库", icon: "table", layer: "trust", category: "knowledge", tier: "free",
    positioning: "一线在用的表格模板，复制到飞书就能用",
    problem: "想提效但不知道好用的表格长什么样",
    audience: "有现成业务、想立刻提效的团队",
    deliverable: "选品评分表 / 供应商评估表 / 库存周转表 / 客服话术库",
    price: "免费 · 留资即得",
    cta_type: "claim", third_party_url: null, third_party_platform: "飞书", planet_url: null,
  },
  {
    id: 6, slug: "case-library", name: "案例库", icon: "folder-open", layer: "trust", category: "knowledge", tier: "free",
    positioning: "真实脱敏案例，每个都附可复用的动作清单",
    problem: "想知道别人是怎么解决同类问题的",
    audience: "想抄作业的务实派",
    deliverable: "图文案例 · 知识库专栏",
    price: "免费 · 留资解锁",
    cta_type: "claim", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  // ---------- 阶梯二：工具包 99-499（解决一个具体问题） ----------
  {
    id: 14, slug: "toolkit-selection", name: "选品评分工具包", icon: "calculator", layer: "conversion", category: "knowledge", tier: "toolkit",
    positioning: "把「要不要进这批货」变成一张能算出分数的表",
    problem: "选品靠感觉，同一个品类这次赚下次亏，说不清为什么",
    audience: "每周要做选品决策的卖家与采购",
    deliverable: "五维评分表（自动算分）+ 测款记录表 + 复盘模板 · 飞书/Excel 双版本",
    price: "¥199",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  {
    id: 15, slug: "toolkit-pricing", name: "核价毛利工具包", icon: "coins", layer: "conversion", category: "knowledge", tier: "toolkit",
    positioning: "算清楚到手多少钱，别再卖一单亏一单",
    problem: "跨境与多平台定价时漏算汇率、佣金、物流与退货，账面赚钱实际亏",
    audience: "做跨境（Ozon/eBay/Temu）与多平台的卖家",
    deliverable: "成本核算表 + 汇率折算器 + 毛利校验表 + 定价决策卡",
    price: "¥299",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  {
    id: 16, slug: "toolkit-fitment", name: "适配校验工具包", icon: "scan-search", layer: "conversion", category: "knowledge", tier: "toolkit",
    positioning: "按三层校验法，把适配数据一条条过一遍",
    problem: "适配数据错了，退货、差评、压货一起来，一次就赔掉几个月利润",
    audience: "被适配问题反复拖住的团队与修理厂",
    deliverable: "交叉验证清单 + 存疑标记表 + 一线回测记录表 + 专家复核申请模板",
    price: "¥399",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  {
    id: 17, slug: "toolkit-inventory", name: "库存周转工具包", icon: "boxes", layer: "conversion", category: "knowledge", tier: "toolkit",
    positioning: "把压在仓库里的钱算清楚，再决定清还是留",
    problem: "滞销 SKU 占压资金，但不知道该清哪些、清多少、走什么渠道",
    audience: "有现货库存的经销商与修理厂",
    deliverable: "安全库存模型 + 滞销分级表 + 渠道分流方案表 + 月度盘库 SOP",
    price: "¥199",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  // ---------- 阶梯三：课程 / 订阅 999-4999（建立体系） ----------
  {
    id: 7, slug: "courses", name: "培训课程", icon: "graduation-cap", layer: "conversion", category: "courses", tier: "course",
    positioning: "录播 + 社群答疑 + 作业批改的体系课",
    problem: "经验零散、体系缺失，学了很多干货还是不会干",
    audience: "0-5 年经验想系统建立方法论的卖家与团队",
    deliverable: "小鹅通课程 · 录播 + 直播答疑 + 结课清单",
    price: "¥999 – ¥3,980 / 门",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  {
    id: 8, slug: "full-reports", name: "完整行业报告", icon: "book", layer: "conversion", category: "reports", tier: "course",
    positioning: "品类数据、价格带、竞争格局与趋势预判",
    problem: "决策缺数据支撑，拍脑袋交学费",
    audience: "需要决策依据的经营者与平台团队",
    deliverable: "飞书文档 · 数据来源与口径全部注明",
    price: "¥899 – ¥1,999 / 份",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  {
    id: 9, slug: "data-subscription", name: "订阅数据产品", icon: "line-chart", layer: "conversion", category: "reports", tier: "course",
    positioning: "品类价格监测 / 跨平台销量追踪 / 竞品动态周报",
    problem: "盯盘靠手工翻平台，慢、口径乱、还容易漏",
    audience: "持续经营、需要盯盘的卖家与类目团队",
    deliverable: "飞书多维表格 / 看板 · 周更 · 支持 7 天试用",
    price: "¥699 起 / 月（年付 ¥4,999 起）",
    cta_type: "consult", third_party_url: null, third_party_platform: "飞书", planet_url: null,
  },
  {
    id: 18, slug: "annual-pass", name: "年度知识通行证", icon: "badge-check", layer: "conversion", category: "courses", tier: "course",
    positioning: "一年内全部课程 + 全部工具包 + 报告更新 + 社群答疑",
    problem: "单买课程和工具包加起来太贵，又不想错过更新",
    audience: "打算长期在这个行业里做的个人与团队（可开多人席位）",
    deliverable: "小鹅通年度权益 + 飞书资料库全权限 + 季度闭门直播",
    price: "¥4,999 / 年",
    cta_type: "buy", third_party_url: null, third_party_platform: "知识星球", planet_url: null,
  },
  // ---------- 阶梯四：咨询 / 内训 / 合作 1万+（解决你自己的问题） ----------
  {
    id: 10, slug: "consulting", name: "咨询方案", icon: "compass", layer: "delivery", category: "consulting", tier: "enterprise",
    positioning: "诊断 + 方案 + 陪跑，只给可落地的动作",
    problem: "有明确的经营问题要解决，缺外部视角与方法",
    audience: "修理厂连锁、经销商集团、成长期卖家",
    deliverable: "诊断报告 + 分阶段路线图 + 月度复盘陪跑",
    price: "¥30,000 起 / 项目",
    cta_type: "consult", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  {
    id: 11, slug: "corporate-training", name: "企业内训", icon: "presentation", layer: "delivery", category: "consulting", tier: "enterprise",
    positioning: "面向团队的定制内训，训后附考核与落地清单",
    problem: "团队依赖老师傅，人走经验走",
    audience: "连锁修理厂、经销商集团、平台类目团队",
    deliverable: "线上 / 驻场 · 1-3 天 · 训后考核",
    price: "¥20,000 起 / 场",
    cta_type: "consult", third_party_url: null, third_party_platform: null, planet_url: null,
  },
  {
    id: 12, slug: "saas-cooperation", name: "SaaS 工具合作", icon: "wrench", layer: "delivery", category: "partners", tier: "enterprise",
    positioning: "我们出行业 Know-how 与种子用户，你出产品力",
    problem: "工具好，但打不进汽配行业、缺场景验证",
    audience: "有成熟产品的 SaaS 团队",
    deliverable: "联合运营 / 内容共建 / 种子用户计划",
    price: "面议 · 分成或共建",
    cta_type: "consult", third_party_url: null, third_party_platform: "合作方平台", planet_url: null,
  },
  {
    id: 13, slug: "ai-data", name: "AI 数据标注 / 模型训练", icon: "bot", layer: "delivery", category: "partners", tier: "enterprise",
    positioning: "汽配领域语料授权、标注规则与评测标准共建",
    problem: "通用模型答不准汽配问题，缺行业语料与评测尺子",
    audience: "AI 公司、大模型厂商、研究机构",
    deliverable: "语料授权（签 DPA）/ 标注规则 / 评测标准共建",
    price: "定制报价 · 签正式协议",
    cta_type: "consult", third_party_url: null, third_party_platform: "合作方平台", planet_url: null,
  },
];

export const FALLBACK_CONTENTS: ContentItem[] = [
  { id: 1, title: "刹车片选品避坑：这 3 种货打死不能进", type: "短视频", platform: "抖音", link: "#", summary: "选品避坑、货源鉴别。", metric: "42万播放", date: "3 天前" },
  { id: 2, title: "俄罗斯 Ozon 汽配爆款拆解：利润藏在适配数据里", type: "短视频", platform: "B站", link: "#", summary: "跨境选品逻辑拆解。", metric: "18万播放", date: "1 周前" },
  { id: 3, title: "拼多多汽配类目 2026 价格带全景图", type: "图文", platform: "公众号", link: "#", summary: "价格带分析与决策参考。", metric: "1.2万阅读", date: "2 天前" },
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
    id: 3, client: "Ozon 跨境团队", group: "从业者与团队",
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

export async function getProducts(): Promise<Product[]> {
  return (await fetchTable<Product>("products")) ?? FALLBACK_PRODUCTS;
}
export async function getContents(): Promise<ContentItem[]> {
  return (await fetchTable<ContentItem>("contents")) ?? FALLBACK_CONTENTS;
}
export async function getCases(): Promise<CaseStudy[]> {
  return (await fetchTable<CaseStudy>("cases")) ?? FALLBACK_CASES;
}
export async function getPartners(): Promise<Partner[]> {
  return (await fetchTable<Partner>("partners")) ?? FALLBACK_PARTNERS;
}
