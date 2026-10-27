"use client";

/* ============================================================
   事件追踪（客户端）
   - 同时推送给 GA4 / Plausible（配了哪个走哪个，可同时配）
   - 并用 sendBeacon 打一份到 /api/track，落 Supabase events 表，
     供 /admin 看板算转化率（分析平台只给了大盘，这里给的是自己的库）
   ============================================================ */

import { getStoredUtm } from "./utm";

export type TrackEventName =
  | "form_submit" // 表单提交
  | "wechat_click" // 点击加企微 / 复制微信号
  | "third_party_click" // 跳转第三方成交页
  | "asset_download" // 资料下载/领取
  | "consult_click" // 预约咨询
  | "ai_chat_open" // AI 问答打开
  | "ladder_click" // 产品阶梯点击
  | "planet_join_intent" // 点击【加入知识星球】/【获取星球入口】
  | "planet_copy" // 复制知识星球链接
  | "wecom_qr_view"; // 展开企微二维码

export interface TrackProps {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (name: string, opts?: { props?: TrackProps }) => void;
  }
}

/** 统一事件上报入口 */
export function trackEvent(name: TrackEventName, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;

  const payload = { ...props, page: window.location.pathname };

  // 1) GA4
  try {
    window.gtag?.("event", name, payload);
  } catch {}

  // 2) Plausible（自定义事件需先在后台建好同名 goal）
  try {
    window.plausible?.(name, { props: payload });
  } catch {}

  // 3) 自己的库（供后台看板）
  try {
    const stored = getStoredUtm();
    const body = JSON.stringify({
      event: name,
      props: payload,
      path: window.location.pathname,
      channel: stored.channel,
      referrer: stored.referrer ?? "",
      ts: new Date().toISOString(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {}
}

/** 站外跳转：先在分析里记一笔，再开新窗口 */
export function trackOutbound(
  name: TrackEventName,
  url: string,
  props: TrackProps = {}
): void {
  trackEvent(name, { ...props, url, platform: props.platform ?? "" });
}
