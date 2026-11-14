/* ============================================================
   数据类型：与 Supabase 表结构一一对应
   ============================================================ */

export type Layer = "traffic" | "trust" | "conversion" | "delivery";
export type CtaType = "claim" | "buy" | "consult";

/** 价格阶梯：免费 → 工具包(99-499) → 数据订阅与会员(999-1999) → 咨询/内训(1万+) */
export type Tier = "free" | "toolkit" | "subscription" | "enterprise";

export const TIERS: Record<Tier, { name: string; range: string; goal: string; note: string }> = {
  free: {
    name: "免费内容",
    range: "¥0",
    goal: "认识我们",
    note: "清单、摘要、模板、避坑知识——能直接照着做，先给再看。",
  },
  toolkit: {
    name: "工具包",
    range: "¥99 – ¥499",
    goal: "解决一个具体问题",
    note: "把一份 SOP 做成可填写、可计算的表格工具，买回去就能用在自己的数据上。",
  },
  subscription: {
    name: "数据订阅与会员版",
    range: "¥999 – ¥1,999",
    goal: "拿到长期查询权",
    note: "开通金游™数据中台专属账号，312 万条底层数据无限次查询，支持按 OE 号、品牌、毛利区间自由检索。",
  },
  enterprise: {
    name: "咨询 / 内训",
    range: "¥10,000 起",
    goal: "解决你自己的问题",
    note: "诊断+方案+陪跑、企业内训、SaaS 与 AI 数据合作——按你的业务定制。",
  },
};

export const TIER_ORDER: Tier[] = ["free", "toolkit", "subscription", "enterprise"];

/** 产品：每个产品必须回答五个问题
 *  适合谁(audience) / 解决什么问题(problem) / 交付什么(deliverable)
 *  怎么收费(price) / 下一步动作(cta_type + third_party_url) */
export interface Product {
  id: number;
  slug: string;
  name: string;
  icon: string; // lucide 图标名，见 components/site/icon.tsx
  layer: Layer;
  category: string; // 归属产品页：knowledge|courses|reports|consulting|partners
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
  tier: Tier; // 价格阶梯
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

export const LAYER_LABELS: Record<Layer, { name: string; desc: string; goal: string }> = {
  traffic: { name: "免费入门", desc: "内容IP · 报告摘要 · SOP清单", goal: "先看，能直接用" },
  trust: { name: "上手试用", desc: "基础知识库 · 模板 · 案例", goal: "先用起来再说" },
  conversion: { name: "数据订阅", desc: "数据中台账号 · 完整报告 · 查询权限", goal: "按需付费，持续查数" },
  delivery: { name: "长期合作", desc: "咨询方案 · 企业内训 · SaaS · AI数据", goal: "定制方案一起做事" },
};

export const LAYER_ORDER: Layer[] = ["traffic", "trust", "conversion", "delivery"];
