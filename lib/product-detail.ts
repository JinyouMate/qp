import type { Product, Tier } from "./types";
import { TIERS, TIER_ORDER } from "./types";

/* ============================================================
   产品详情页内容层
   - 默认模板：由产品已有字段推导（痛点/交付清单/使用步骤/FAQ）
   - 重点产品可定制：在 PRODUCT_EXTRA 里按 slug 覆盖
   新增产品不写这里也能出详情页，写了会更具体。
   ============================================================ */

export interface ProductFaq {
  q: string;
  a: string;
}

export interface ProductDetail {
  /** 你会遇到这些情况（场景痛点） */
  pains: string[];
  /** 拿到手是什么（交付清单） */
  checklist: string[];
  /** 怎么用（步骤） */
  steps: string[];
  /** 本产品专属 FAQ */
  faqs: ProductFaq[];
  /** 交付形式 */
  form: string;
  /** 更新频率 */
  update: string;
  /** 见效周期（不夸大，给区间） */
  timeline: string;
}

/** 按分隔符把 deliverable 拆成清单条目 */
function splitList(text: string): string[] {
  return text
    .split(/[+＋、，,／\/]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** 按 CTA 类型给出默认使用步骤 */
function defaultSteps(p: Product): string[] {
  if (p.cta_type === "claim") {
    return [
      "提交表单，加企业微信，回复【汽配数据】",
      "我们会把资料发给你，并按你的身份给一份使用建议",
      "照着清单在你的业务上跑一遍，卡住的点直接在群里问",
    ];
  }
  if (p.cta_type === "buy") {
    return [
      "先加企业微信确认你要解决的是不是这个问题",
      "确认后从小鹅通/飞书完成购买（官网不处理支付）",
      "拿到文件后填你自己的数据，第一周先算一个品类做验证",
    ];
  }
  return [
    "提交需求，我们约一次 30 分钟的现状沟通",
    "给你一份针对你情况的诊断结论与推进路线",
    "确认合作范围后进入方案与排期",
  ];
}

/** 按档位给出默认痛点补充 */
function tierPains(tier: Tier): string[] {
  switch (tier) {
    case "free":
      return [
        "想判断我们靠不靠谱，但不想先付钱",
        "网上资料太散，不知道哪些能直接用",
      ];
    case "toolkit":
      return [
        "道理都懂，落到自己数据上就算不明白",
        "请人做太贵，自己做又不知道表格该长什么样",
      ];
    case "course":
      return [
        "看过很多干货，真到自己上手还是不会",
        "团队水平不齐，缺一套能统一口径的方法",
      ];
    case "enterprise":
      return [
        "问题很具体，通用方法套不上去",
        "内部推不动，需要外部视角和陪跑",
      ];
  }
}

function defaultFaqs(p: Product): ProductFaq[] {
  const base: ProductFaq[] = [
    {
      q: "官网能直接付款吗？",
      a: p.cta_type === "buy"
        ? "不能，也刻意不做。成交与交付在小鹅通/飞书等第三方平台完成，官网只做说明、路由与跳转，这样你的售后与发票都在平台侧有保障。"
        : "不涉及付费。留资后我们直接把资料发给你，不需要在官网付款。",
    },
    {
      q: "多久能拿到？",
      a: p.cta_type === "claim"
        ? "加微信后回复【汽配数据】，一般当天内发给你。"
        : p.cta_type === "buy"
          ? "购买后即时获取；需要开票或定制的，1 个工作日内处理。"
          : "提交后 1 个工作日内联系你约沟通时间。",
    },
  ];
  if (p.tier === "toolkit" || p.tier === "course") {
    base.push({
      q: "可以开发票吗？",
      a: "可以。第三方平台下单后按平台流程申请电子发票，我们在平台侧配合。",
    });
  }
  if (p.tier === "enterprise") {
    base.push({
      q: "数据合规怎么处理？",
      a: "涉及数据的合作先签数据授权与保密协议（DPA），明确来源、用途与留存期限；个人信息一律脱敏后再进入分析与标注环节。",
    });
  }
  return base;
}

/** 重点产品定制内容（没有的产品走默认模板） */
const PRODUCT_EXTRA: Record<string, Partial<ProductDetail>> = {
  "toolkit-selection": {
    pains: [
      "选品靠感觉，赢了不知道为什么赢，输了只知道亏了",
      "每周都要决定进什么货，但没有一张表能把判断过程固定下来",
      "新人问「为什么选这个」，答不上来，全靠老师傅拍脑袋",
    ],
    checklist: [
      "五维评分表（需求/竞争/毛利/适配风险/履约难度，自动加权出分）",
      "测款记录表（小批量试销的数据回收模板）",
      "复盘模板（成与败都留档，形成你自己的选品库）",
    ],
    steps: [
      "填 5 个维度的原始判断，表格自动算出加权分数与建议（进 / 试 / 弃）",
      "先用小批量跑一轮测款，把真实数据回写到记录表",
      "每月复盘一次，把踩过的坑变成你自己的权重调整依据",
    ],
    form: "Excel / 飞书表格（可复制为自己的表）",
    update: "版本更新时邮件通知，已购用户免费拿新版",
    timeline: "第一次用到出结论约 1 小时，形成习惯约 2-3 周",
  },
  "toolkit-pricing": {
    pains: [
      "跨境和多平台定价时漏算汇率、佣金、物流，卖得越多亏得越多",
      "毛利算不清楚，促销一做就穿底",
      "不同平台口径不一样，手工换算容易错",
    ],
    checklist: [
      "成本核算表（采购/物流/佣金/汇损/退换预留，一栏不漏）",
      "汇率折算器（按当天汇率自动换算，带安全垫设置）",
      "毛利校验表（定价后反推到手毛利与保本点）",
    ],
    steps: [
      "把一批货的真实成本逐项填进去，先算出到手成本",
      "设置你自己的目标毛利率与安全垫，得到建议售价区间",
      "每次调价前用校验表反推一遍，防止促销穿底",
    ],
    form: "Excel / 飞书表格",
    update: "汇率与平台费率规则变更时同步更新",
    timeline: "当天就能用于正在定价的这批货",
  },
  "toolkit-fitment": {
    pains: [
      "适配错了导致退货、差评、压货，一条数据错一片链接受影响",
      "OE 号一物多号、一号多物，人工核对不过来",
      "平台判责时拿不出自己的校验记录",
    ],
    checklist: [
      "交叉验证清单（多源比对 OE 号、车型年款、参数的逐项核对项）",
      "存疑标记表（无法确认的条目单独留档，不硬写）",
      "一线回测记录表（装车/实测结果回填，形成闭环）",
    ],
    steps: [
      "按清单对每条适配数据做多源交叉比对，存疑的打标不发布",
      "把存疑条目拿去一线回测，实测结果回填记录表",
      "专家复核后归档，形成你自己的可信适配库",
    ],
    form: "Excel / 飞书表格 + 校验流程说明",
    update: "按季度补充新车型与常见错配案例",
    timeline: "第一批数据过完约 1-2 天，之后成为日常流程",
  },
  "toolkit-inventory": {
    pains: [
      "不知道压了多少钱在仓库，滞销品舍不得清",
      "畅销品经常断货，滞销品常年不动",
      "想清库存但不知道先清哪些、清到什么价位",
    ],
    checklist: [
      "安全库存模型（按周转天数算每个 SKU 的补货点）",
      "滞销分级表（按库龄与金额给每个 SKU 定级）",
      "分流方案模板（清仓 / 打包 / 转平台的处理顺序与定价建议）",
    ],
    steps: [
      "导出库存，用安全库存模型算出哪些该补、哪些该停",
      "滞销分级表按库龄和占压金额排序，得到清仓优先级",
      "按分流方案逐档处理，回笼资金后再复盘一次周转",
    ],
    form: "Excel / 飞书表格",
    update: "随滞销处理经验补充新场景",
    timeline: "一轮盘点约半天，资金回笼视清仓节奏而定",
  },
  courses: {
    pains: [
      "看过很多免费内容，真到自己上手还是不会",
      "学的东西和自己的品类对不上，听完就忘",
      "没人批改，不知道自己做得对不对",
    ],
    steps: [
      "录播按模块推进，每模块配一份要交的作业",
      "作业提交后逐份批改，指出你具体错在哪一步",
      "社群答疑，同类问题一次讲清，沉淀进知识库",
    ],
    form: "小鹅通录播 + 作业批改 + 社群答疑",
    update: "课程内容按平台规则变化每年更新",
    timeline: "按每周一个模块的节奏，约 4-6 周走完",
  },
  "ai-data": {
    pains: [
      "通用大模型答汽配问题经常一本正经地胡说",
      "缺行业语料和标注规则，模型训不出来",
      "评测没有标准，不知道模型到底进步没有",
    ],
    checklist: [
      "行业语料授权（签 DPA，明确来源、范围与期限）",
      "标注规则共建（OE/VIN/适配关系的标注口径与边界）",
      "评测标准共建（题库 + 评分口径 + 回归测试集）",
    ],
    steps: [
      "先对齐场景与数据范围，签数据授权与保密协议",
      "共同确定标注规则，我们出初版，你们校验后定稿",
      "交付语料与标注结果，按评测标准跑回归，迭代",
    ],
    form: "按项目定制交付（语料 / 标注规则 / 评测集）",
    update: "按项目约定迭代",
    timeline: "首轮对齐 1-2 周，交付视数据量而定",
  },
};

/**
 * 产品 → 表单 demand 字段映射（深链预填用）。
 * 注意：必须放在非 "use client" 模块，服务端组件才能直接调用。
 */
export function demandForProduct(p: Product): string {
  if (p.slug === "sop-checklists") return "SOP";
  if (p.slug === "report-briefs" || p.slug === "full-reports") return "报告";
  if (p.slug === "data-subscription") return "数据产品";
  if (p.slug === "ai-data") return "AI合作";
  if (p.slug === "saas-cooperation") return "SaaS";
  switch (p.category) {
    case "knowledge":
      return "知识库";
    case "courses":
      return "课程";
    case "reports":
      return "报告";
    case "consulting":
      return "咨询";
    default:
      return "知识库";
  }
}

/** 档位对比：本档 vs 相邻档 */
export function tierCompare(tier: Tier): { current: string; lower?: string; higher?: string } {
  const i = TIER_ORDER.indexOf(tier);
  return {
    current: TIERS[tier].name,
    lower: i > 0 ? TIERS[TIER_ORDER[i - 1]].name : undefined,
    higher: i < TIER_ORDER.length - 1 ? TIERS[TIER_ORDER[i + 1]].name : undefined,
  };
}

/** 取产品的详情内容（定制优先，缺省用模板推导） */
export function getProductDetail(p: Product): ProductDetail {
  const extra = PRODUCT_EXTRA[p.slug] ?? {};
  return {
    pains: extra.pains ?? [p.problem, ...tierPains(p.tier)],
    checklist: extra.checklist ?? splitList(p.deliverable),
    steps: extra.steps ?? defaultSteps(p),
    faqs: extra.faqs ?? defaultFaqs(p),
    form: extra.form ?? "线上交付（文件 / 表格 / 在线文档）",
    update: extra.update ?? "随业务变化持续更新",
    timeline:
      extra.timeline ?? (p.tier === "enterprise" ? "视项目范围而定" : "上手当天可用"),
  };
}
