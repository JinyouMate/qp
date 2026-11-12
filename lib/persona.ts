/* ============================================================
   四类访客身份 → 产品推荐路由
   首页入口点击后跳 /products?role=xxx，产品中心据此把该身份
   该看的产品排到最前并打「为你推荐」标。
   repair / dealer 为历史身份（已合并为 shop，仅保留兼容）。
   ============================================================ */

export type PersonaKey = "seller" | "shop" | "repair" | "dealer" | "enterprise" | "ai";

export interface Persona {
  key: PersonaKey;
  /** 表单里的身份字段值（与 leads.identity 取值一致） */
  identity: string;
  label: string;
  need: string;
  pain: string;
  give: string;
  /** 推荐产品 slug，按优先级排列 */
  recommended: string[];
  /** 默认预填的需求字段 */
  demand: string;
  /** 表单 intent 参数 */
  intent: "asset" | "consult";
}

export const PERSONAS: Record<PersonaKey, Persona> = {
  seller: {
    key: "seller",
    identity: "零售/跨境卖家",
    label: "零售 / 跨境卖家",
    need: "想少踩坑多出单",
    pain: "卖汽配退货率太高？选品总踩坑？平台规则合规搞不清？",
    give: "爆款选品数据 + OE 码匹配工具 + 平台合规 SOP",
    recommended: ["toolkit-selection", "toolkit-fitment", "sop-checklists", "knowledge-base"],
    demand: "选品数据",
    intent: "asset",
  },
  /**修理厂 + 汽配商合并后的身份（首页第 2 张卡） */
  shop: {
    key: "shop",
    identity: "修理厂/汽配商",
    label: "修理厂 / 汽配商",
    need: "想解决具体业务问题 / 想系统搭建体系",
    pain: "采购乱、压资金？干货看了没体系、没方法？",
    give: "SOP 清单 + 库存周转模板 + 体系课 + 复盘社群",
    recommended: [
      "sop-checklists", "toolkit-inventory", "toolkit-fitment", "templates",
      "knowledge-base", "courses", "annual-pass", "case-library",
    ],
    demand: "SOP",
    intent: "asset",
  },
  repair: {
    key: "repair",
    identity: "修理厂",
    label: "修理厂 / 经销商",
    need: "想解决具体问题",
    pain: "散采价格乱、断货频繁、滞销压资金、报价靠拍脑袋。",
    give: "SOP 清单 + 供应商分级方法 + 库存周转模板",
    recommended: ["sop-checklists", "toolkit-inventory", "toolkit-fitment", "templates", "case-library"],
    demand: "SOP",
    intent: "asset",
  },
  dealer: {
    key: "dealer",
    identity: "汽配商",
    label: "汽配商 / 从业者",
    need: "想系统学习",
    pain: "干货看了一堆，轮到自己干还是没体系、没方法。",
    give: "基础知识库 + 体系课 + 每周复盘社群",
    recommended: ["knowledge-base", "courses", "toolkit-selection", "toolkit-pricing", "annual-pass"],
    demand: "课程",
    intent: "asset",
  },
  enterprise: {
    key: "enterprise",
    identity: "平台企业",
    label: "平台 / 企业",
    need: "想合作数据产品",
    pain: "类目评估靠人工翻平台，慢、口径乱、结论不可复用。",
    give: "订阅数据看板 + 评估模板 + 定制报告",
    recommended: ["data-subscription", "full-reports", "report-briefs", "consulting"],
    demand: "数据产品",
    intent: "consult",
  },
  ai: {
    key: "ai",
    identity: "AI公司",
    label: "AI 公司",
    need: "想合作行业数据",
    pain: "通用模型答不准汽配问题，缺语料、缺标注规则、缺评测尺子。",
    give: "语料授权（签 DPA）+ 标注规则 + 评测集共建",
    recommended: ["ai-data", "saas-cooperation", "knowledge-base"],
    demand: "AI合作",
    intent: "consult",
  },
};

/** 首页入口的展示顺序（第 1 张是转化主路径） */
export const PERSONA_ORDER: PersonaKey[] = ["seller", "shop", "enterprise", "ai"];

/** 从 URL 参数解析身份，非法值返回 null（不报错，退化为无推荐） */
export function getPersona(key?: string | string[] | null): Persona | null {
  if (!key || Array.isArray(key)) return null;
  return PERSONAS[key as PersonaKey] ?? null;
}

