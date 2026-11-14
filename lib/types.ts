/* ============================================================
   数据类型：与 Supabase 表结构一一对应
   ============================================================ */

export type CtaType = "claim" | "buy" | "consult";

/* ------------------------------------------------------------------
   三库商业矩阵（2026-11-14 定调）
   全站不再使用「流量层 / 信任层 / 转化层 / 交付层」这类内部黑话，
   也不再有「四档」说法：所有产品只归入三个板块。
   ------------------------------------------------------------------ */
export type Library = "kb" | "tools" | "data" | "custom";

export const LIBRARIES: Record<
  Library,
  { name: string; en: string; tagline: string; price: string; goal: string; note: string }
> = {
  kb: {
    name: "知识库",
    en: "KNOWLEDGE",
    tagline: "构建行业认知",
    price: "免费 / ¥9.9 引流",
    goal: "先把行业看明白",
    note: "避坑指南、行业报告、合规 SOP —— 让你在动手之前就知道哪里会踩坑。",
  },
  tools: {
    name: "工具库",
    en: "TOOLKIT",
    tagline: "现成工具，直接落地",
    price: "¥99 – ¥299",
    goal: "把一个动作做出结果",
    note: "选品评分表、核价毛利计算器、库存周转模板 —— 拿过去填自己的数，当天能用。",
  },
  data: {
    name: "数据库",
    en: "DATABASE",
    tagline: "开通金游智库专属查询账号，看透真实利润",
    price: "¥999 / 年",
    goal: "用真实数据做决策",
    note: "312 万 SKU、OE 号匹配、万家供货商评级 —— 不是给你一份报表，是给你随时能查的底账。",
  },
  custom: {
    name: "定制合作",
    en: "CUSTOM",
    tagline: "按你的业务定制",
    price: "¥30,000 起 / 项目",
    goal: "解决你自己的问题",
    note: "基于 312 万条交易大盘的诊断、方案与陪跑，以及 SaaS 与 AI 数据合作。",
  },
};

export const LIBRARY_ORDER: Library[] = ["kb", "tools", "data"];

/** 产品：每个产品必须回答五个问题
 *  适合谁(audience) / 解决什么问题(problem) / 交付什么(deliverable)
 *  怎么收费(price) / 下一步动作(cta_type + third_party_url) */
export interface Product {
  id: number;
  slug: string;
  name: string;
  icon: string; // lucide 图标名，见 components/site/icon.tsx
  /** 三库归类：kb / tools / data / custom */
  library: Library;
  category: string; // 归属产品页：knowledge|reports|consulting|partners
  positioning: string; // 一句话定位
  problem: string; // 解决什么问题
  audience: string; // 适合谁
  deliverable: string; // 交付什么
  price: string; // 怎么收费
  cta_type: CtaType; // 下一步动作：统一弹主理人企微名片
  /** 历史字段，已废弃：不再跳转任何第三方平台链接，前端统一改弹企微二维码 */
  third_party_url: string | null;
  /** 历史字段，已废弃：交付平台统一为企业微信 */
  third_party_platform: string | null;
  /** 历史字段，已废弃（原知识星球邀请链接） */
  planet_url: string | null;
}

export interface ContentItem {
  id: number;
  title: string;
  type: string; // 短视频 / 图文 / 直播回放
  platform: string; // 抖音 / 视频号 / B站 / 公众号
  link: string;
  summary: string;
  metric: string; // 播放 / 阅读数据
  date: string;
}

export interface CaseMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: number;
  client: string;
  group: string; // 修理厂与经销商 / 从业者与团队 / 平台企业与AI
  problem: string;
  solution: string;
  metrics: CaseMetric[];
}

export interface Partner {
  id: number;
  name: string;
  cooperation_type: string;
}

export interface Lead {
  id?: number;
  name: string;
  contact: string;
  role: string; // 修理厂 / 汽配商 / 平台企业 / AI公司 / 其他
  demand: string; // 知识库 / 数据产品 / SOP / 报告 / 数据订阅 / 咨询 / SaaS / AI合作
  description?: string;
  utm?: Record<string, string>;
  channel?: Channel; // 来源渠道：抖音/视频号/知乎/公众号/搜索/直接访问/其他
  status?: string; // new / contacted / won / closed
  created_at?: string;
}

/** 来源渠道 */
export type Channel =
  | "douyin"
  | "channels" // 视频号
  | "zhihu"
  | "wechat_mp" // 公众号
  | "bilibili"
  | "search"
  | "direct"
  | "other";

export const CHANNEL_LABELS: Record<Channel, string> = {
  douyin: "抖音",
  channels: "视频号",
  zhihu: "知乎",
  wechat_mp: "公众号",
  bilibili: "B站",
  search: "搜索",
  direct: "直接访问",
  other: "其他",
};
