/* ============================================================
   数据类型：与 Supabase 表结构一一对应
   ============================================================ */

export type Layer = "traffic" | "trust" | "conversion" | "delivery";
export type CtaType = "claim" | "buy" | "consult";

/** 价格阶梯：免费 → 工具包(99-499) → 课程/订阅(999-4999) → 咨询/内训(1万+) */
export type Tier = "free" | "toolkit" | "course" | "enterprise";

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
  course: {
    name: "课程 / 订阅",
    range: "¥999 – ¥4,999",
    goal: "建立体系与持续能力",
    note: "体系课（录播+答疑+批改）、完整报告、订阅数据看板——从会做一次到持续会做。",
  },
  enterprise: {
    name: "咨询 / 内训",
    range: "¥10,000 起",
    goal: "解决你自己的问题",
    note: "诊断+方案+陪跑、企业内训、SaaS 与 AI 数据合作——按你的业务定制。",
  },
};

export const TIER_ORDER: Tier[] = ["free", "toolkit", "course", "enterprise"];

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
  cta_type: CtaType; // 下一步动作：免费领取 / 去第三方购买 / 预约咨询
  third_party_url: string | null; // 第三方平台/内容入口（自动附加 UTM）
  third_party_platform: string | null; // 小鹅通 / 知识星球 / 飞书 / Baklib / 合作方平台
  /** 知识星球专属邀请链接。留资后才会下发（复制/跳转） */
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
  demand: string; // 知识库 / 数据产品 / SOP / 报告 / 课程 / 咨询 / SaaS / AI合作
  description?: string;
  utm?: Record<string, string>;
  channel?: Channel; // 留资来源：抖音/视频号/知乎/公众号/搜索/直接访问/其他
  status?: string; // new / contacted / won / closed
  created_at?: string;
}

/** 留资来源渠道 */
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
  traffic: { name: "流量层", desc: "内容IP · 报告摘要 · SOP清单", goal: "认识我们" },
  trust: { name: "信任层", desc: "基础知识库 · 模板 · 案例", goal: "建立信任" },
  conversion: { name: "转化层", desc: "培训课程 · 完整报告 · 订阅数据", goal: "深度使用" },
  delivery: { name: "交付层", desc: "咨询方案 · 企业内训 · SaaS · AI数据", goal: "长期合作" },
};

export const LAYER_ORDER: Layer[] = ["traffic", "trust", "conversion", "delivery"];
