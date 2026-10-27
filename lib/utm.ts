"use client";

/**
 * UTM 追踪与来源渠道归类（客户端）
 * - 首次落地时把 utm_* 与 referrer 存入 localStorage
 * - 自动推断来源渠道：抖音 / 视频号 / 知乎 / 公众号 / B站 / 搜索 / 直接访问 / 其他
 * - 表单提交时随线索一起发送
 * - 第三方跳转链接统一附加 utm_source=official_site
 */

import type { Channel } from "./types";

const UTM_KEY = "qipei_utm";
const CHANNEL_KEY = "qipei_channel";

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing?: string;
  ts?: string;
}

export interface StoredUtm extends UtmData {
  channel?: Channel;
}

/* ---------- 渠道推断 ---------- */

const DOMAIN_RULES: { test: RegExp; channel: Channel }[] = [
  { test: /douyin\.com|iesdouyin\.com/, channel: "douyin" },
  { test: /weixin\.qq\.com|channels\.weixin|wechat\.com/, channel: "channels" },
  { test: /zhihu\.com|zhimg\.com/, channel: "zhihu" },
  { test: /mp\.weixin\.qq\.com/, channel: "wechat_mp" },
  { test: /bilibili\.com|b23\.tv/, channel: "bilibili" },
  {
    test: /baidu\.com|google\.com|bing\.com|sogou\.com|so\.com|360\.cn|sm\.cn/,
    channel: "search",
  },
];

const SOURCE_RULES: Record<string, Channel> = {
  douyin: "douyin",
  "抖音": "douyin",
  channels: "channels",
  shipinhao: "channels",
  视频号: "channels",
  weixin: "channels",
  wechat: "channels",
  zhihu: "zhihu",
  知乎: "zhihu",
  wechat_mp: "wechat_mp",
  mp: "wechat_mp",
  gongzhonghao: "wechat_mp",
  公众号: "wechat_mp",
  bilibili: "bilibili",
  b23: "bilibili",
  baidu: "search",
  google: "search",
  bing: "search",
  sogou: "search",
  search: "search",
  搜索: "search",
  direct: "direct",
  直接访问: "direct",
};

/** 从 UTM / referrer 推断来源渠道 */
export function inferChannel(utm: UtmData): Channel {
  const src = (utm.utm_source || "").toLowerCase().trim();
  if (src && SOURCE_RULES[src]) return SOURCE_RULES[src];

  // 从 medium 兜底
  const medium = (utm.utm_medium || "").toLowerCase();
  if (medium.includes("social") || medium.includes("cpc")) {
    const ref = (utm.referrer || "").toLowerCase();
    for (const r of DOMAIN_RULES) {
      if (r.test.test(ref)) return r.channel;
    }
  }

  const ref = (utm.referrer || "").toLowerCase();
  if (ref) {
    for (const r of DOMAIN_RULES) {
      if (r.test.test(ref)) return r.channel;
    }
    return "other";
  }

  // 有 utm 但判不出来
  if (src) return "other";
  return Object.keys(utm).length === 0 ? "direct" : "other";
}

export function captureUtm(): void {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const utm: UtmData = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = p.get(k);
    if (v) utm[k as keyof UtmData] = v;
  });
  if (document.referrer) utm.referrer = document.referrer;

  const channel = inferChannel(utm);

  utm.ts = new Date().toISOString();
  utm.landing = window.location.pathname + window.location.search;

  try {
    // 只在首次落地写入，后续访问沿用最初来源（首触归因）
    const existing = localStorage.getItem(CHANNEL_KEY);
    if (!existing) localStorage.setItem(CHANNEL_KEY, channel);
    localStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {}
}

export function getStoredUtm(): StoredUtm {
  if (typeof window === "undefined") return { channel: "direct" };
  try {
    const utm = JSON.parse(localStorage.getItem(UTM_KEY) || "{}") as UtmData;
    const channel =
      (localStorage.getItem(CHANNEL_KEY) as Channel | null) ?? inferChannel(utm) ?? "direct";
    return { ...utm, channel };
  } catch {
    return { channel: "direct" };
  }
}

/**
 * 第三方链接统一附加 UTM：
 *   utm_source=website（官网是来源）
 *   utm_medium=product | link | gate（位置）
 *   utm_campaign=<产品 slug 或需求名>（具体是哪个产品带来的）
 */
export function withUtm(url: string, campaign?: string, medium: string = "product"): string {
  if (!url || url === "#" || !/^https?:\/\//.test(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "website");
    u.searchParams.set("utm_medium", medium);
    if (campaign) u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * 知识星球入口链接的 UTM 规范（三个参数固定）：
 *   ?utm_source=website&utm_medium=product&utm_campaign={product_id}
 *
 * - campaign 用**产品 id**（不是 slug），与后台 products.id 一一对应，便于对账
 * - URL 本身带 query 时自动用 & 连接，不会拼出两个 ?
 * - 非法 / 空链接返回空串，调用方自行判断
 */
export function withPlanetUtm(url: string | null, productId: number | string): string {
  if (!url || url === "#") return "";
  return withUtm(url, String(productId), "product");
}
